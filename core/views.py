from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.generics import CreateAPIView
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Company, IPO, Subscription, Announcement
from .serializers import (
    CompanySerializer, IPOSerializer,
    SubscriptionSerializer, AnnouncementSerializer,
    UserCreateSerializer
)

# 🏢 Company APIs
class CompanyViewSet(viewsets.ModelViewSet):
    queryset = Company.objects.all()
    serializer_class = CompanySerializer

# 💸 IPO APIs
class IPOViewSet(viewsets.ModelViewSet):
    queryset = IPO.objects.all().order_by('-opening_date')  # ✅ Ensures pagination is consistent
    serializer_class = IPOSerializer
    permission_classes = [IsAuthenticated]

# 📥 Subscription APIs
class SubscriptionViewSet(viewsets.ModelViewSet):
    queryset = Subscription.objects.all()
    serializer_class = SubscriptionSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)  # 🔐 Auto-assign user

    def get_queryset(self):
     return Subscription.objects.filter(user=self.request.user).order_by('-application_date')

# 📣 Announcement APIs
class AnnouncementViewSet(viewsets.ModelViewSet):
    queryset = Announcement.objects.all()
    serializer_class = AnnouncementSerializer
    permission_classes = [IsAuthenticated]

# 🚀 IPO Create-only endpoint (if needed separately)
class IPOCreateView(CreateAPIView):
    queryset = IPO.objects.all()
    serializer_class = IPOSerializer
    permission_classes = [IsAuthenticated]

# 📝 Signup Endpoint — Public access
class RegisterView(APIView):
    permission_classes = [AllowAny]  # 👈 Important: No token required for signup

    def post(self, request):
        serializer = UserCreateSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'User created successfully'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)