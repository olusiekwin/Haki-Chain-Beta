from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.translation import gettext_lazy as _

class User(AbstractUser):
    class Role(models.TextChoices):
        ADMIN = 'admin', _('Admin')
        NGO = 'ngo', _('NGO')
        LAWYER = 'lawyer', _('Lawyer')
        DONOR = 'donor', _('Donor')
    
    role = models.CharField(
        max_length=10,
        choices=Role.choices,
        default=Role.DONOR,
    )
    
    email = models.EmailField(_('email address'), unique=True)
    profile_image = models.ImageField(upload_to='profile_images/', null=True, blank=True)
    bio = models.TextField(blank=True)
    organization = models.CharField(max_length=255, blank=True)
    location = models.CharField(max_length=255, blank=True)
    wallet_address = models.CharField(max_length=255, blank=True)
    is_verified = models.BooleanField(default=False)
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']
    
    def __str__(self):
        return self.email

class LawyerProfile(models.Model):
    class VerificationStatus(models.TextChoices):
        PENDING = 'pending', _('Pending')
        VERIFIED = 'verified', _('Verified')
        REJECTED = 'rejected', _('Rejected')
    
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='lawyer_profile')
    law_society_number = models.CharField(max_length=50)
    jurisdiction = models.CharField(max_length=100)
    specialization = models.CharField(max_length=100, blank=True)
    years_of_experience = models.PositiveIntegerField(default=0)
    verification_status = models.CharField(
        max_length=10,
        choices=VerificationStatus.choices,
        default=VerificationStatus.PENDING,
    )
    id_document = models.FileField(upload_to='lawyer_documents/id/', null=True)
    law_society_document = models.FileField(upload_to='lawyer_documents/certificates/', null=True)
    verification_notes = models.TextField(blank=True)
    
    def __str__(self):
        return f"{self.user.email} - {self.law_society_number}"

class NGOProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='ngo_profile')
    registration_number = models.CharField(max_length=50)
    registration_document = models.FileField(upload_to='ngo_documents/', null=True)
    website = models.URLField(blank=True)
    year_established = models.PositiveIntegerField(null=True, blank=True)
    
    def __str__(self):
        return f"{self.user.email} - {self.registration_number}"

class DonorProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='donor_profile')
    total_donated = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    
    def __str__(self):
        return self.user.email

