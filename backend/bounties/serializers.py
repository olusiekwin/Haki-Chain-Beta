from rest_framework import serializers
from .models import Bounty, Milestone, Donation, BountyDocument, Review
from users.serializers import UserSerializer, LawyerProfileSerializer

class MilestoneSerializer(serializers.ModelSerializer):
    class Meta:
        model = Milestone
        fields = ['id', 'bounty', 'title', 'description', 'amount', 'status',
                  'due_date', 'completed_date', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']

class DonationSerializer(serializers.ModelSerializer):
    donor = UserSerializer(read_only=True)
    
    class Meta:
        model = Donation
        fields = ['id', 'bounty', 'donor', 'amount', 'transaction_id', 'created_at']
        read_only_fields = ['id', 'created_at']

class BountyDocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = BountyDocument
        fields = ['id', 'bounty', 'title', 'file', 'uploaded_at']
        read_only_fields = ['id', 'uploaded_at']

class ReviewSerializer(serializers.ModelSerializer):
    reviewer = UserSerializer(read_only=True)
    
    class Meta:
        model = Review
        fields = ['id', 'bounty', 'reviewer', 'rating', 'comment', 'created_at']
        read_only_fields = ['id', 'created_at']

class BountySerializer(serializers.ModelSerializer):
    ngo = UserSerializer(read_only=True)
    lawyer = LawyerProfileSerializer(read_only=True)
    milestones = MilestoneSerializer(many=True, read_only=True)
    donations = DonationSerializer(many=True, read_only=True)
    documents = BountyDocumentSerializer(many=True, read_only=True)
    reviews = ReviewSerializer(many=True, read_only=True)
    
    class Meta:
        model = Bounty
        fields = ['id', 'title', 'description', 'long_description', 'category',
                  'location', 'funding_goal', 'current_funding', 'deadline',
                  'ngo', 'lawyer', 'status', 'created_at', 'updated_at',
                  'admin_notes', 'milestones', 'donations', 'documents', 'reviews']
        read_only_fields = ['id', 'current_funding', 'created_at', 'updated_at', 'admin_notes']

class BountyCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Bounty
        fields = ['title', 'description', 'long_description', 'category',
                  'location', 'funding_goal', 'deadline']
    
    def create(self, validated_data):
        user = self.context['request'].user
        
        if user.role != 'ngo':
            raise serializers.ValidationError("Only NGOs can create bounties")
        
        # Set status to pending for admin approval
        bounty = Bounty.objects.create(
            ngo=user,
            status=Bounty.Status.PENDING,
            **validated_data
        )
        
        return bounty

