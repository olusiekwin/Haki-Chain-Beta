from rest_framework import serializers
from .models import User, LawyerProfile, NGOProfile, DonorProfile

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'username', 'first_name', 'last_name', 'role', 
                  'profile_image', 'bio', 'organization', 'location', 
                  'wallet_address', 'is_verified', 'date_joined']
        read_only_fields
                  'wallet_address', 'is_verified', 'date_joined']
        read_only_fields = ['id', 'date_joined', 'is_verified']

class LawyerProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = LawyerProfile
        fields = ['id', 'user', 'law_society_number', 'jurisdiction', 'specialization',
                  'years_of_experience', 'verification_status', 'id_document',
                  'law_society_document', 'verification_notes']
        read_only_fields = ['id', 'verification_status', 'verification_notes']

class NGOProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = NGOProfile
        fields = ['id', 'user', 'registration_number', 'registration_document',
                  'website', 'year_established']
        read_only_fields = ['id']

class DonorProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = DonorProfile
        fields = ['id', 'user', 'total_donated']
        read_only_fields = ['id', 'total_donated']

class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    confirm_password = serializers.CharField(write_only=True)
    
    class Meta:
        model = User
        fields = ['email', 'username', 'password', 'confirm_password', 'first_name', 'last_name', 'role']
    
    def validate(self, data):
        if data['password'] != data.pop('confirm_password'):
            raise serializers.ValidationError("Passwords do not match")
        return data
    
    def create(self, validated_data):
        user = User.objects.create_user(
            email=validated_data['email'],
            username=validated_data['username'],
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            role=validated_data.get('role', User.Role.DONOR)
        )
        
        # Create corresponding profile based on role
        if user.role == User.Role.LAWYER:
            LawyerProfile.objects.create(user=user)
        elif user.role == User.Role.NGO:
            NGOProfile.objects.create(user=user)
        elif user.role == User.Role.DONOR:
            DonorProfile.objects.create(user=user)
        
        return user

class LawyerVerificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = LawyerProfile
        fields = ['law_society_number', 'jurisdiction', 'specialization',
                  'years_of_experience', 'id_document', 'law_society_document']

