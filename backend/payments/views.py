from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import Payment, Token, TokenTransaction, Withdrawal, TokenConversion
from .serializers import (
    PaymentSerializer, TokenSerializer, TokenTransactionSerializer,
    WithdrawalSerializer, TokenConversionSerializer
)
from users.permissions import IsOwnerOrAdmin
from blockchain.services import HederaService

class PaymentViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = PaymentSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        return Payment.objects.filter(receiver=user) | Payment.objects.filter(sender=user)

class TokenViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = TokenSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        return Token.objects.filter(user=user)
    
    @action(detail=False, methods=['get'])
    def balance(self, request):
        user = request.user
        token, created = Token.objects.get_or_create(user=user)
        return Response({'balance': token.balance})

class TokenTransactionViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = TokenTransactionSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        return TokenTransaction.objects.filter(token__user=user) | TokenTransaction.objects.filter(sender=user) | TokenTransaction.objects.filter(receiver=user)

class WithdrawalViewSet(viewsets.ModelViewSet):
    serializer_class = WithdrawalSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrAdmin]
    
    def get_queryset(self):
        user = self.request.user
        return Withdrawal.objects.filter(user=user)
    
    def perform_create(self, serializer):
        user = self.request.user
        amount = serializer.validated_data.get('amount')
        withdrawal_type = serializer.validated_data.get('withdrawal_type')
        
        # Check if user has sufficient balance
        payments_total = Payment.objects.filter(receiver=user, status=Payment.Status.COMPLETED).aggregate(
            total=models.Sum('amount')
        )['total'] or 0
        
        withdrawals_total = Withdrawal.objects.filter(user=user, status__in=[
            Withdrawal.Status.COMPLETED, Withdrawal.Status.PROCESSING, Withdrawal.Status.PENDING
        ]).aggregate(total=models.Sum('amount'))['total'] or 0
        
        available_balance = payments_total - withdrawals_total
        
        if amount > available_balance:
            raise serializers.ValidationError("Insufficient balance for withdrawal")
        
        # Process withdrawal through Hedera
        try:
            hedera_service = HederaService()
            
            # Bank withdrawal details
            bank_details = None
            if withdrawal_type == Withdrawal.Type.BANK:
                bank_details = {
                    'bank_name': serializer.validated_data.get('bank_name'),
                    'account_number': serializer.validated_data.get('bank_account_number'),
                    'routing_number': serializer.validated_data.get('bank_routing_number')
                }
            
            # Crypto withdrawal details
            crypto_details = None
            if withdrawal_type == Withdrawal.Type.CRYPTO:
                crypto_details = {
                    'address': serializer.validated_data.get('crypto_address'),
                    'network': serializer.validated_data.get('crypto_network')
                }
            
            # Process withdrawal
            transaction_id = hedera_service.process_withdrawal(
                user_id=str(user.id),
                amount=float(amount),
                withdrawal_type=withdrawal_type,
                bank_details=bank_details,
                crypto_details=crypto_details
            )
            
            # Save withdrawal with transaction ID
            serializer.save(
                user=user,
                status=Withdrawal.Status.PROCESSING,
                transaction_id=transaction_id
            )
            
        except Exception as e:
            raise serializers.ValidationError(str(e))

class TokenConversionViewSet(viewsets.ModelViewSet):
    serializer_class = TokenConversionSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrAdmin]
    
    def get_queryset(self):
        user = self.request.user
        return TokenConversion.objects.filter(user=user)
    
    def perform_create(self, serializer):
        user = self.request.user
        token_amount = serializer.validated_data.get('token_amount')
        
        # Check if user has sufficient token balance
        token, created = Token.objects.get_or_create(user=user)
        
        if token_amount > token.balance:
            raise serializers.ValidationError("Insufficient token balance for conversion")
        
        # Process token conversion through Hedera
        try:
            hedera_service = HederaService()
            conversion_rate = 0.32  # $0.32 per HAKI token
            usd_amount = token_amount * conversion_rate
            
            # Convert tokens to USD
            result = hedera_service.convert_tokens_to_usd(
                user_id=str(user.id),
                token_amount=float(token_amount),
                conversion_rate=conversion_rate
            )
            
            # Update token balance
            token.balance -= token_amount
            token.save()
            
            # Create token transaction record
            TokenTransaction.objects.create(
                token=token,
                amount=token_amount,
                transaction_type=TokenTransaction.Type.BURN,
                sender=user,
                bounty=None
            )
            
            # Save conversion with transaction ID
            serializer.save(
                user=user,
                usd_amount=usd_amount,
                conversion_rate=conversion_rate,
                status=TokenConversion.Status.COMPLETED,
                transaction_id=result['transaction_id']
            )
            
        except Exception as e:
            raise serializers.ValidationError(str(e))

