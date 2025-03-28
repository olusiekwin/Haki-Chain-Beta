from rest_framework import serializers
from .models import Payment, Escrow, Token, TokenTransaction, Withdrawal, TokenConversion
from users.serializers import UserSerializer
from bounties.serializers import BountySerializer, MilestoneSerializer

class PaymentSerializer(serializers.ModelSerializer):
    sender = UserSerializer(read_only=True)
    receiver = UserSerializer(read_only=True)
    bounty = BountySerializer(read_only=True)
    milestone = MilestoneSerializer(read_only=True)
    
    class Meta:
        model = Payment
        fields = '__all__'

class EscrowSerializer(serializers.ModelSerializer):
    bounty = BountySerializer(read_only=True)
    
    class Meta:
        model = Escrow
        fields = '__all__'

class TokenSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = Token
        fields = '__all__'

class TokenTransactionSerializer(serializers.ModelSerializer):
    token = TokenSerializer(read_only=True)
    sender = UserSerializer(read_only=True)
    receiver = UserSerializer(read_only=True)
    bounty = BountySerializer(read_only=True)
    
    class Meta:
        model = TokenTransaction
        fields = '__all__'

class WithdrawalSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = Withdrawal
        fields = '__all__'
        read_only_fields = ['user', 'status', 'transaction_id', 'transaction_data']
    
    def validate(self, data):
        withdrawal_type = data.get('withdrawal_type')
        
        # Validate bank withdrawal details
        if withdrawal_type == Withdrawal.Type.BANK:
            if not data.get('bank_name'):
                raise serializers.ValidationError("Bank name is required for bank withdrawals")
            if not data.get('bank_account_number'):
                raise serializers.ValidationError("Bank account number is required for bank withdrawals")
            if not data.get('bank_routing_number'):
                raise serializers.ValidationError("Bank routing number is required for bank withdrawals")
        
        # Validate crypto withdrawal details
        if withdrawal_type == Withdrawal.Type.CRYPTO:
            if not data.get('crypto_address'):
                raise serializers.ValidationError("Crypto address is required for crypto withdrawals")
            if not data.get('crypto_network'):
                raise serializers.ValidationError("Crypto network is required for crypto withdrawals")
        
        return data

class TokenConversionSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = TokenConversion
        fields = '__all__'
        read_only_fields = ['user', 'usd_amount', 'conversion_rate', 'status', 'transaction_id', 'transaction_data']

