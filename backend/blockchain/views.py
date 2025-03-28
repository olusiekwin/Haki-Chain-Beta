from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import BlockchainTransaction, EscrowContract, TokenBalance, TokenTransaction
from .serializers import (
    BlockchainTransactionSerializer, EscrowContractSerializer,
    TokenBalanceSerializer, TokenTransactionSerializer
)
from .services import hedera_service
from users.permissions import IsAdminUser, IsOwnerOrAdmin

class BlockchainTransactionViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = BlockchainTransaction.objects.all()
    serializer_class = BlockchainTransactionSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        if user.is_staff or user.role == 'admin':
            return BlockchainTransaction.objects.all()
        return BlockchainTransaction.objects.filter(user=user)

class EscrowContractViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = EscrowContract.objects.all()
    serializer_class = EscrowContractSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        if user.is_staff or user.role == 'admin':
            return EscrowContract.objects.all()
        
        # Regular users can only see escrows related to their bounties
        if user.role == 'ngo':
            return EscrowContract.objects.filter(bounty__ngo=user)
        elif user.role == 'lawyer':
            return EscrowContract.objects.filter(bounty__lawyer__user=user)
        
        # Donors can see escrows they've contributed to
        return EscrowContract.objects.filter(bounty__donations__donor=user).distinct()

class TokenBalanceViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = TokenBalance.objects.all()
    serializer_class = TokenBalanceSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        if user.is_staff or user.role == 'admin':
            return TokenBalance.objects.all()
        return TokenBalance.objects.filter(user=user)
    
    @action(detail=False, methods=['get'])
    def my_balance(self, request):
        user = request.user
        try:
            token_balance = TokenBalance.objects.get(user=user)
        except TokenBalance.DoesNotExist:
            token_balance = TokenBalance.objects.create(user=user)
        
        serializer = self.get_serializer(token_balance)
        return Response(serializer.data)

class TokenTransactionViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = TokenTransaction.objects.all()
    serializer_class = TokenTransactionSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        if user.is_staff or user.role == 'admin':
            return TokenTransaction.objects.all()
        
        # Users can see transactions where they are sender or receiver
        return TokenTransaction.objects.filter(
            from_user=user
        ) | TokenTransaction.objects.filter(
            to_user=user
        )
    
    @action(detail=False, methods=['get'])
    def my_transactions(self, request):
        queryset = self.get_queryset()
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

```python file="backend/blockchain/serializers.py"
from rest_framework import serializers
from .models import BlockchainTransaction, EscrowContract, TokenBalance, TokenTransaction
from users.serializers import UserSerializer
from bounties.serializers import BountySerializer, MilestoneSerializer

class BlockchainTransactionSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = BlockchainTransaction
        fields = ['id', 'transaction_id', 'transaction_type', 'status', 'user', 
                  'bounty', 'milestone', 'data', 'error_message', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']

class EscrowContractSerializer(serializers.ModelSerializer):
    bounty = BountySerializer(read_only=True)
    
    class Meta:
        model = EscrowContract
        fields = ['id', 'bounty', 'contract_id', 'total_amount', 'released_amount', 
                  'status', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']

class TokenBalanceSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = TokenBalance
        fields = ['id', 'user', 'balance', 'updated_at']
        read_only_fields = ['id', 'updated_at']

class TokenTransactionSerializer(serializers.ModelSerializer):
    from_user = UserSerializer(read_only=True)
    to_user = UserSerializer(read_only=True)
    
    class Meta:
        model = TokenTransaction
        fields = ['id', 'transaction_id', 'transaction_type', 'from_user', 'to_user', 
                  'amount', 'bounty', 'created_at']
        read_only_fields = ['id', 'created_at']

