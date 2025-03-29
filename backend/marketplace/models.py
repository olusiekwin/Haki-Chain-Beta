from django.db import models
from django.contrib.auth.models import User

class MarketplaceItem(models.Model):
    CATEGORY_CHOICES = (
        ('templates', 'Templates'),
        ('documents', 'Documents'),
        ('services', 'Services'),
        ('bundles', 'Bundles'),
    )
    
    title = models.CharField(max_length=255)
    description = models.TextField()
    price = models.DecimalField(max_digits=18, decimal_places=8)
    seller = models.ForeignKey(User, on_delete=models.CASCADE, related_name='marketplace_items')
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    file_url = models.URLField(null=True, blank=True)
    file_hash = models.CharField(max_length=255, null=True, blank=True)
    preview_url = models.URLField(null=True, blank=True)
    is_active = models.BooleanField(default=True)
    is_on_chain = models.BooleanField(default=False)
    blockchain_tx_hash = models.CharField(max_length=255, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.title
    
    @property
    def seller_username(self):
        return self.seller.username if self.seller else None

class Purchase(models.Model):
    item = models.ForeignKey(MarketplaceItem, on_delete=models.CASCADE, related_name='purchases')
    buyer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='purchases')
    transaction_hash = models.CharField(max_length=255, null=True, blank=True)
    price_paid = models.DecimalField(max_digits=18, decimal_places=8)
    is_on_chain = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.buyer.username} purchased {self.item.title}"
    
    class Meta:
        unique_together = ('item', 'buyer')

