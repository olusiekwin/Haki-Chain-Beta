from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import WalletAddress, BlockchainTransaction, TokenBalance, TokenTransaction
from .serializers import (
    WalletAddressSerializer, 
    BlockchainTransactionSerializer, 
    TokenBalanceSerializer,
    TokenTransactionSerializer
)
from django.contrib.auth.models import User

class WalletAddressViewSet(viewsets.ModelViewSet):
    serializer_class = WalletAddressSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return WalletAddress.objects.filter(user=self.request.user)
    
    @action(detail=False, methods=['post'])
    def link_wallet(self, request):
        wallet_address = request.data.get('wallet_address')
        if not wallet_address:
            return Response({'error': 'Wallet address is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Check if wallet is already linked to another user
        existing_wallet = WalletAddress.objects.filter(address=wallet_address).first()
        if existing_wallet and existing_wallet.user != request.user:
            return Response({'error': 'This wallet is already linked to another account'}, 
                           status=status.HTTP_400_BAD_REQUEST)
        
        # Get or create wallet for current user
        wallet, created = WalletAddress.objects.get_or_create(
            user=request.user,
            defaults={'address': wallet_address}
        )
        
        if not created:
            wallet.address = wallet_address
            wallet.save()
        
        # Create token balance record if it doesn't exist
        TokenBalance.objects.get_or_create(user=request.user)
        
        return Response({
            'success': True,
            'wallet_address': wallet.address,
            'is_verified': wallet.is_verified
        })

class BlockchainTransactionViewSet(viewsets.ModelViewSet):
    serializer_class = BlockchainTransactionSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return BlockchainTransaction.objects.filter(
            from_address=self.request.user.wallet.address
        ) | BlockchainTransaction.objects.filter(
            to_address=self.request.user.wallet.address
        )

class TokenBalanceViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = TokenBalanceSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return TokenBalance.objects.filter(user=self.request.user)
    
    @action(detail=False, methods=['get'])
    def my_balance(self, request):
        try:
            balance = TokenBalance.objects.get(user=request.user)
            serializer = self.get_serializer(balance)
            return Response(serializer.data)
        except TokenBalance.DoesNotExist:
            return Response({'balance': '0', 'last_synced': None})

class TokenTransactionViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = TokenTransactionSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return TokenTransaction.objects.filter(
            from_user=self.request.user
        ) | TokenTransaction.objects.filter(
            to_user=self.request.user
        )

class BlockchainSyncViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]
    
    @action(detail=False, methods=['post'])
    def sync(self, request):
        wallet_address = request.data.get('wallet_address')
        bounties = request.data.get('bounties', [])
        token_balance = request.data.get('token_balance')
        
        # Verify wallet belongs to user
        try:
            wallet = WalletAddress.objects.get(user=request.user)
            if wallet.address != wallet_address:
                return Response({'error': 'Wallet address does not match user'}, 
                               status=status.HTTP_400_BAD_REQUEST)
        except WalletAddress.DoesNotExist:
            return Response({'error': 'User has no linked wallet'}, 
                           status=status.HTTP_400_BAD_REQUEST)
        
        # Update token balance
        if token_balance is not None:
            balance, created = TokenBalance.objects.get_or_create(
                user=request.user,
                defaults={'balance': token_balance}
            )
            if not created:
                balance.balance = token_balance
                balance.save()
        
        # Process bounties
        synced_bounties = 0
        for bounty_data in bounties:
            # Update corresponding bounty in database
            # This would depend on your Bounty model structure
            synced_bounties += 1
        
        return Response({
            'success': True,
            'message': f'Synchronized {synced_bounties} bounties and updated token balance',
            'token_balance': token_balance
        })

