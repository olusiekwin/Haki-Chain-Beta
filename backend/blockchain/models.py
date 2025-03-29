from django.db import models
from django.contrib.auth.models import User

class WalletAddress(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='wallet')
    address = models.CharField(max_length=255, unique=True)
    is_verified = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.username}'s wallet: {self.address}"

class BlockchainTransaction(models.Model):
    TRANSACTION_TYPES = (
        ('token_transfer', 'Token Transfer'),
        ('bounty_creation', 'Bounty Creation'),
        ('bounty_acceptance', 'Bounty Acceptance'),
        ('bounty_completion', 'Bounty Completion'),
        ('marketplace_listing', 'Marketplace Listing'),
        ('marketplace_purchase', 'Marketplace Purchase'),
    )
    
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('failed', 'Failed'),
    )
    
    tx_hash = models.CharField(max_length=255, unique=True)
    from_address = models.CharField(max_length=255)
    to_address = models.CharField(max_length=255, null=True, blank=True)
    amount = models.DecimalField(max_digits=18, decimal_places=8, null=True, blank=True)
    transaction_type = models.CharField(max_length=50, choices=TRANSACTION_TYPES)
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='pending')
    bounty = models.ForeignKey('bounties.Bounty', on_delete=models.SET_NULL, null=True, blank=True, related_name='transactions')
    marketplace_item = models.ForeignKey('marketplace.MarketplaceItem', on_delete=models.SET_NULL, null=True, blank=True, related_name='transactions')
    data = models.JSONField(null=True, blank=True)
    error_message = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.transaction_type} - {self.tx_hash[:10]}..."

class TokenBalance(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='token_balance')
    balance = models.DecimalField(max_digits=18, decimal_places=8, default=0)
    last_synced = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.user.username}'s balance: {self.balance}"

class TokenTransaction(models.Model):
    TRANSACTION_TYPES = (
        ('transfer', 'Transfer'),
        ('reward', 'Reward'),
        ('purchase', 'Purchase'),
        ('refund', 'Refund'),
    )
    
    transaction_id = models.CharField(max_length=255, unique=True)
    transaction_type = models.CharField(max_length=50, choices=TRANSACTION_TYPES)
    from_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sent_transactions', null=True, blank=True)
    to_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='received_transactions', null=True, blank=True)
    amount = models.DecimalField(max_digits=18, decimal_places=8)
    bounty = models.ForeignKey('bounties.Bounty', on_delete=models.SET_NULL, null=True, blank=True, related_name='token_transactions')
    blockchain_tx = models.ForeignKey(BlockchainTransaction, on_delete=models.SET_NULL, null=True, blank=True, related_name='token_transactions')
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.transaction_type} - {self.amount} tokens"

