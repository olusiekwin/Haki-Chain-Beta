from rest_framework import viewsets, permissions, status, generics
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from .models import User, LawyerProfile, NGOProfile, DonorProfile
from .serializers import (
    UserSerializer, LawyerProfileSerializer, NGOProfileSerializer,
    DonorProfileSerializer, UserRegistrationSerializer, LawyerVerificationSerializer
)
from .permissions import IsAdminUser, IsOwnerOrAdmin

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_permissions(self):
        if self.action == 'create':
            return [permissions.AllowAny()]
        elif self.action in ['update', 'partial_update', 'destroy']:
            return [IsOwnerOrAdmin()]
        return super().get_permissions()
    
    @action(detail=False, methods=['post'])
    def login(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        
        user = authenticate(email=email, password=password)
        
        if user:
            refresh = RefreshToken.for_user(user)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'user': UserSerializer(user).data
            })
        
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
    
    @action(detail=False, methods=['post'])
    def register(self, request):
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            refresh = RefreshToken.for_user(user)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'user': UserSerializer(user).data
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['get'])
    def me(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)
    
    @action(detail=False, methods=['post'])
    def connect_wallet(self, request):
        user = request.user
        wallet_address = request.data.get('wallet_address')
        
        if not wallet_address:
            return Response({'error': 'Wallet address is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        user.wallet_address = wallet_address
        user.save()
        
        return Response(UserSerializer(user).data)

class LawyerProfileViewSet(viewsets.ModelViewSet):
    queryset = LawyerProfile.objects.all()
    serializer_class = LawyerProfileSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_permissions(self):
        if self.action in ['verify', 'reject']:
            return [IsAdminUser()]
        return super().get_permissions()
    
    @action(detail=True, methods=['post'])
    def verify(self, request, pk=None):
        lawyer_profile = self.get_object()
        notes = request.data.get('notes', '')
        
        lawyer_profile.verification_status = LawyerProfile.VerificationStatus.VERIFIED
        lawyer_profile.verification_notes = notes
        lawyer_profile.save()
        
        # Also mark the user as verified
        lawyer_profile.user.is_verified = True
        lawyer_profile.user.save()
        
        return Response(LawyerProfileSerializer(lawyer_profile).data)
    
    @action(detail=True, methods=['post'])
    def reject(self, request, pk=None):
        lawyer_profile = self.get_object()
        notes = request.data.get('notes', '')
        
        lawyer_profile.verification_status = LawyerProfile.VerificationStatus.REJECTED
        lawyer_profile.verification_notes = notes
        lawyer_profile.save()
        
        return Response(LawyerProfileSerializer(lawyer_profile).data)
    
    @action(detail=False, methods=['post'])
    def submit_verification(self, request):
        user = request.user
        
        if user.role != User.Role.LAWYER:
            return Response({'error': 'Only lawyers can submit verification'}, status=status.HTTP_403_FORBIDDEN)
        
        try:
            lawyer_profile = LawyerProfile.objects.get(user=user)
        except LawyerProfile.DoesNotExist:
            return Response({'error': 'Lawyer profile not found'}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = LawyerVerificationSerializer(lawyer_profile, data=request.data, partial=True)
        if serializer.is_valid():
            # Handle file uploads
            id_document = request.FILES.get('documents[0]')
            law_society_document = request.FILES.get('documents[1]')
            
            if id_document:
                lawyer_profile.id_document = id_document
            
            if law_society_document:
                lawyer_profile.law_society_document = law_society_document
            
            # Save other fields from serializer
            lawyer_profile = serializer.save(verification_status=LawyerProfile.VerificationStatus.PENDING)
            
            return Response(LawyerProfileSerializer(lawyer_profile).data)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['get'])
    def pending_verification(self, request):
        """Get all lawyers pending verification (admin only)"""
        if not request.user.is_staff and not request.user.is_superuser:
            return Response({'error': 'Not authorized'}, status=status.HTTP_403_FORBIDDEN)
        
        pending_lawyers = LawyerProfile.objects.filter(
            verification_status=LawyerProfile.VerificationStatus.PENDING
        )
        
        serializer = LawyerProfileSerializer(pending_lawyers, many=True)
        return Response(serializer.data)

