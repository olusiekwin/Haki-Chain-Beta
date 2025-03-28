from django.db import models
from users.models import User
from bounties.models import Bounty, Milestone

class Payment(models.Model):
    class Status(models.TextChoices):
        PENDING = 'pending', 'Pending'
        COMPLETED = 'completed', 'Completed'
        FAILED = 'failed', 'Failed'
        REFUNDED = 'refunded', 'Refunded'
    
    class Type(models.TextChoices):
        DONATION = 'donation', 'Donation'
        MILESTONE = 'milestone', 'Milestone Payment'
        REFUND = 'refund', 'Refund'
    
    bounty = models.ForeignKey(Bounty, on_delete=models.CASCADE, related_name='payments')
    milestone = models.ForeignKey(Milestone, on_delete=models.SET_NULL, null=True, blank=True, related_name='payments')
    
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sent_payments')
    receiver = models.ForeignKey(User, on_delete=models.CASCADE, related_name='received_payments', null=True, blank=True)
    
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    payment_type = models.CharField(max_length=20, choices=Type.choices)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PENDING)
    
    transaction_id = models.CharField(max_length=255, blank=True)
    transaction_data = models.JSONField(default=dict, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.payment_type} - {self.bounty.title} - ${self.amount}"

class Escrow(models.Model):
    class Status(models.TextChoices):
        ACTIVE = 'active', 'Active'
        RELEASED = 'released', 'Released'
        REFUNDED = 'refunded', 'Refunded'
    
    bounty = models.OneToOneField(Bounty, on_delete=models.CASCADE, related_name='escrow')
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.ACTIVE)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"Escrow - {self.bounty.title} - ${self.amount}"

class Token(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='tokens')
    balance = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    
    def __str__(self):
        return f"{self.user.email} - {self.balance} HAKI"

class TokenTransaction(models.Model):
    class Type(models.TextChoices):
        REWARD = 'reward', 'Reward'
        TRANSFER = 'transfer', 'Transfer'
        BURN = 'burn', 'Burn'
    
    token = models.ForeignKey(Token, on_delete=models.CASCADE, related_name='transactions')
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    transaction_type = models.CharField(max_length=20, choices=Type.choices)
    
    sender = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='sent_token_transactions')
    receiver = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='received_token_transactions')
    
    bounty = models.ForeignKey(Bounty, on_delete=models.SET_NULL, null=True, blank=True, related_name='token_transactions')
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.transaction_type} - {self.token.user.email} - {self.amount} HAKI"

class Withdrawal(models.Model):
    class Status(models.TextChoices):
        PENDING = 'pending', 'Pending'
        PROCESSING = 'processing', 'Processing'
        COMPLETED = 'completed', 'Completed'
        FAILED = 'failed', 'Failed'
    
    class Type(models.TextChoices):
        BANK = 'bank', 'Bank Transfer'
        CRYPTO = 'crypto', 'Cryptocurrency'
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='withdrawals')
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    withdrawal_type = models.CharField(max_length=20, choices=Type.choices)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PENDING)
    
    bank_name = models.CharField(max_length=255, blank=True, null=True)
    bank_account_number = models.CharField(max_length=255, blank=True, null=True)
    bank_routing_number = models.CharField(max_length=255, blank=True, null=True)
    
    crypto_address = models.CharField(max_length=255, blank=True, null=True)
    crypto_network = models.CharField(max_length=255, blank=True, null=True)
    
    transaction_id = models.CharField(max_length=255, blank=True)
    transaction_data = models.JSONField(default=dict, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.withdrawal_type} - {self.user.email} - ${self.amount}"

class TokenConversion(models.Model):
    class Status(models.TextChoices):
        PENDING = 'pending', 'Pending'
        COMPLETED = 'completed', 'Completed'
        FAILED = 'failed', 'Failed'
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='token_conversions')
    token_amount = models.DecimalField(max_digits=10, decimal_places=2)
    usd_amount = models.DecimalField(max_digits=10, decimal_places=2)
    conversion_rate = models.DecimalField(max_digits=10, decimal_places=6)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PENDING)
    
    transaction_id = models.CharField(max_length=255, blank=True)
    transaction_data = models.JSONField(default=dict, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"Conversion - {self.user.email} - {self.token_amount} HAKI to ${self.usd_amount}"

