from django.db import models
from users.models import User
from bounties.models import Bounty, Milestone

class BlockchainTransaction(models.Model):
    class Status(models.TextChoices):
        PENDING = 'pending', 'Pending'
        COMPLETED = 'completed', 'Completed'
        FAILED = 'failed', 'Failed'
    
    class Type(models.TextChoices):
        CREATE_ESCROW = 'create_escrow', 'Create Escrow'
        RELEASE_MILESTONE = 'release_milestone', 'Release Milestone'
        REFUND_ESCROW = 'refund_escrow', 'Refund Escrow'
        MINT_TOKEN = 'mint_token', 'Mint Token'
        TRANSFER_TOKEN = 'transfer_token', 'Transfer Token'
        ADD_REVIEW = 'add_review', 'Add Review'
    
    transaction_id = models.CharField(max_length=100, unique=True)
    transaction_type = models.CharField(max_length=50, choices=Type.choices)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PENDING)
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='blockchain_transactions')
    bounty = models.ForeignKey(Bounty, on_delete=models.CASCADE, related_name='blockchain_transactions', null=True, blank=True)
    milestone = models.ForeignKey(Milestone, on_delete=models.CASCADE, related_name='blockchain_transactions', null=True, blank=True)
    
    data = models.JSONField(default=dict, blank=True)
    error_message = models.TextField(blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.transaction_type} - {self.transaction_id} - {self.status}"

class EscrowContract(models.Model):
    bounty = models.OneToOneField(Bounty, on_delete=models.CASCADE, related_name='escrow_contract')
    contract_id = models.CharField(max_length=100, unique=True)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    released_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    
    class Status(models.TextChoices):
        ACTIVE = 'active', 'Active'
        COMPLETED = 'completed', 'Completed'
        REFUNDED = 'refunded', 'Refunded'
    
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.ACTIVE)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"Escrow for {self.bounty.title} - {self.contract_id}"

class TokenBalance(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='token_balance')
    balance = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.user.email} - {self.balance} HAKI"

class TokenTransaction(models.Model):
    class Type(models.TextChoices):
        MINT = 'mint', 'Mint'
        TRANSFER = 'transfer', 'Transfer'
        BURN = 'burn', 'Burn'
    
    transaction_id = models.CharField(max_length=100, unique=True)
    transaction_type = models.CharField(max_length=20, choices=Type.choices)
    
    from_user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='sent_token_transactions')
    to_user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='received_token_transactions')
    
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    bounty = models.ForeignKey(Bounty, on_delete=models.SET_NULL, null=True, blank=True, related_name='token_transactions')
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.transaction_type} - {self.amount} HAKI - {self.transaction_id}"

