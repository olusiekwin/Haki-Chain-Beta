from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import Bounty, Milestone, Donation, BountyDocument, Review
from .serializers import (
    BountySerializer, BountyCreateSerializer, MilestoneSerializer,
    DonationSerializer, BountyDocumentSerializer, ReviewSerializer
)
from users.permissions import IsAdminUser, IsOwnerOrAdmin
from blockchain.services import HederaService
from payments.models import Payment, Escrow, Token, TokenTransaction

class BountyViewSet(viewsets.ModelViewSet):
    queryset = Bounty.objects.all()
    serializer_class = BountySerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_serializer_class(self):
        if self.action == 'create':
            return BountyCreateSerializer
        return BountySerializer
    
    def get_permissions(self):
        if self.action in ['approve', 'reject']:
            return [IsAdminUser()]
        elif self.action in ['update', 'partial_update', 'destroy']:
            return [IsOwnerOrAdmin()]
        return super().get_permissions()
    
    def get_serializer_context(self):
        context = super().get_serializer_context()
        context.update({"request": self.request})
        return context
    
    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        bounty = self.get_object()
        notes = request.data.get('notes', '')
        
        if bounty.status != Bounty.Status.PENDING:
            return Response({'error': 'Only pending bounties can be approved'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Create escrow contract on Hedera
        try:
            hedera_service = HederaService()
            
            # Extract milestone data
            milestones = [
                {
                    'id': str(milestone.id),
                    'amount': float(milestone.amount),
                    'description': milestone.description
                }
                for milestone in bounty.milestones.all()
            ]
            
            # Create escrow contract
            contract_id = hedera_service.create_escrow(
                bounty_id=str(bounty.id),
                ngo_id=str(bounty.ngo.id),
                total_amount=float(bounty.funding_goal),
                milestones=milestones
            )
            
            # Update bounty with contract ID
            bounty.contract_id = contract_id
            bounty.status = Bounty.Status.ACTIVE
            bounty.admin_notes = notes
            bounty.save()
            
            return Response(BountySerializer(bounty).data)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    @action(detail=True, methods=['post'])
    def reject(self, request, pk=None):
        bounty = self.get_object()
        notes = request.data.get('notes', '')
        
        if bounty.status != Bounty.Status.PENDING:
            return Response({'error': 'Only pending bounties can be rejected'}, status=status.HTTP_400_BAD_REQUEST)
        
        bounty.status = Bounty.Status.REJECTED
        bounty.admin_notes = notes
        bounty.save()
        
        return Response(BountySerializer(bounty).data)
    
    @action(detail=True, methods=['post'])
    def claim(self, request, pk=None):
        bounty = self.get_object()
        user = request.user
        message = request.data.get('message', '')
        
        if user.role != 'lawyer':
            return Response({'error': 'Only lawyers can claim bounties'}, status=status.HTTP_403_FORBIDDEN)
        
        if not hasattr(user, 'lawyer_profile'):
            return Response({'error': 'Lawyer profile not found'}, status=status.HTTP_404_NOT_FOUND)
        
        if user.lawyer_profile.verification_status != 'verified':
            return Response({'error': 'Only verified lawyers can claim bounties'}, status=status.HTTP_403_FORBIDDEN)
        
        if bounty.status != Bounty.Status.ACTIVE:
            return Response({'error': 'Only active bounties can be claimed'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Update bounty status
        bounty.lawyer = user.lawyer_profile
        bounty.status = Bounty.Status.CLAIMED
        bounty.save()
        
        # Update first milestone to in-progress
        first_milestone = bounty.milestones.first()
        if first_milestone:
            first_milestone.status = Milestone.Status.IN_PROGRESS
            first_milestone.save()
        
        return Response(BountySerializer(bounty).data)
    
    @action(detail=True, methods=['post'])
    def donate(self, request, pk=None):
        bounty = self.get_object()
        user = request.user
        amount = request.data.get('amount')
        
        if not amount:
            return Response({'error': 'Amount is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            amount = float(amount)
        except ValueError:
            return Response({'error': 'Invalid amount'}, status=status.HTTP_400_BAD_REQUEST)
        
        if amount <= 0:
            return Response({'error': 'Amount must be positive'}, status=status.HTTP_400_BAD_REQUEST)
        
        if bounty.status not in [Bounty.Status.ACTIVE, Bounty.Status.CLAIMED]:
            return Response({'error': 'Can only donate to active or claimed bounties'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Create donation
        donation = Donation.objects.create(
            bounty=bounty,
            donor=user,
            amount=amount
        )
        
        # Update bounty funding
        bounty.current_funding += amount
        bounty.save()
        
        # Update donor profile
        if hasattr(user, 'donor_profile'):
            user.donor_profile.total_donated += amount
            user.donor_profile.save()
        
        return Response(DonationSerializer(donation).data)

class MilestoneViewSet(viewsets.ModelViewSet):
    queryset = Milestone.objects.all()
    serializer_class = MilestoneSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    @action(detail=True, methods=['post'])
    def complete(self, request, pk=None):
        milestone = self.get_object()
        bounty = milestone.bounty
        user = request.user
        notes = request.data.get('notes', '')
        evidence = request.FILES.get('evidence')
        
        # Check if user is the lawyer assigned to the bounty
        if not hasattr(user, 'lawyer_profile') or bounty.lawyer != user.lawyer_profile:
            return Response({'error': 'Only the assigned lawyer can complete milestones'}, status=status.HTTP_403_FORBIDDEN)
        
        if milestone.status != Milestone.Status.IN_PROGRESS:
            return Response({'error': 'Only in-progress milestones can be completed'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Update milestone status
        milestone.status = Milestone.Status.COMPLETED
        milestone.completion_notes = notes
        
        if evidence:
            milestone.evidence = evidence
        
        milestone.save()
        
        return Response(MilestoneSerializer(milestone).data)
    
    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        milestone = self.get_object()
        bounty = milestone.bounty
        user = request.user
        notes = request.data.get('notes', '')
        
        # Check if user is the NGO that created the bounty
        if bounty.ngo != user:
            return Response({'error': 'Only the NGO can approve milestones'}, status=status.HTTP_403_FORBIDDEN)
        
        if milestone.status != Milestone.Status.COMPLETED:
            return Response({'error': 'Only completed milestones can be approved'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            # Release payment on Hedera
            hedera_service = HederaService()
            
            transaction_id = hedera_service.release_milestone_payment(
                contract_id=bounty.contract_id,
                milestone_id=str(milestone.id),
                lawyer_id=str(bounty.lawyer.user.id)
            )
            
            # Create payment record
            payment = Payment.objects.create(
                bounty=bounty,
                milestone=milestone,
                sender=user,
                receiver=bounty.lawyer.user,
                amount=milestone.amount,
                payment_type=Payment.Type.MILESTONE,
                status=Payment.Status.COMPLETED,
                transaction_id=transaction_id
            )
            
            # Update milestone status
            milestone.status = Milestone.Status.RELEASED
            milestone.approval_notes = notes
            milestone.transaction_id = transaction_id
            milestone.save()
            
            # Check if all milestones are released
            all_released = True
            next_milestone = None
            
            for i, m in enumerate(bounty.milestones.all()):
                if m.id == milestone.id and i + 1 < bounty.milestones.count():
                    next_milestone = bounty.milestones.all()[i + 1]
                
                if m.status != Milestone.Status.RELEASED:
                    all_released = False
            
            # If all milestones are released, mark bounty as completed
            if all_released:
                bounty.status = Bounty.Status.COMPLETED
                bounty.save()
                
                # Mint HAKI tokens as reward to the lawyer
                token_amount = float(bounty.funding_goal) * 0.05  # 5% of funding goal as reward
                token_tx_id = hedera_service.mint_tokens(
                    recipient_id=str(bounty.lawyer.user.id),
                    amount=token_amount,
                    reason=f"Completed bounty: {bounty.title}"
                )
                
                # Create or update token balance
                token, created = Token.objects.get_or_create(user=bounty.lawyer.user)
                token.balance += token_amount
                token.save()
                
                # Create token transaction record
                TokenTransaction.objects.create(
                    token=token,
                    amount=token_amount,
                    transaction_type=TokenTransaction.Type.REWARD,
                    receiver=bounty.lawyer.user,
                    bounty=bounty
                )
                
            elif next_milestone:
                # Set next milestone to in-progress
                next_milestone.status = Milestone.Status.IN_PROGRESS
                next_milestone.save()
            
            return Response(MilestoneSerializer(milestone).data)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

