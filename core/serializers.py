from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Company, IPO, Subscription, Announcement

# 🏢 Company
class CompanySerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = '__all__'

# 💸 IPO
class IPOSerializer(serializers.ModelSerializer):
    company = CompanySerializer(read_only=True)  # 👈 Access nested company data
    rhpLink = serializers.SerializerMethodField()
    drhpLink = serializers.SerializerMethodField()

    class Meta:
        model = IPO
        fields = [
            'id',
            'company',
            'issue_price',
            'opening_date',
            'closing_date',
            'total_shares',
            'status',
            'rhpLink',
            'drhpLink',
        ]

    def get_rhpLink(self, obj):
        return obj.rhp_file.url if obj.rhp_file else None

    def get_drhpLink(self, obj):
        return obj.drhp_file.url if obj.drhp_file else None

# 📥 Subscription
class SubscriptionSerializer(serializers.ModelSerializer):
    ipo = IPOSerializer(read_only=True)  # ✅ For GET response
    ipo_id = serializers.PrimaryKeyRelatedField(
        queryset=IPO.objects.all(), source='ipo', write_only=True
    )

    class Meta:
        model = Subscription
        fields = ['id', 'ipo', 'ipo_id', 'shares_applied', 'status', 'application_date']
        read_only_fields = ['user', 'application_date','status']

# 📣 Announcement
class AnnouncementSerializer(serializers.ModelSerializer):
    class Meta:
        model = Announcement
        fields = '__all__'

# 👤 User Signup Serializer
class UserCreateSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    confirm_password = serializers.CharField(write_only=True)
    full_name = serializers.CharField(required=True)
    phone = serializers.CharField(required=False, allow_blank=True)
    role = serializers.CharField(required=False)

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'confirm_password', 'full_name', 'phone', 'role']

    def validate(self, data):
        if data['password'] != data['confirm_password']:
            raise serializers.ValidationError("Passwords don't match.")
        return data

    def create(self, validated_data):
        validated_data.pop('confirm_password')
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data['full_name']
        )
        # TODO: Save phone/role via UserProfile if needed
        return user