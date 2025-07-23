from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    CompanyViewSet, IPOViewSet,
    SubscriptionViewSet, AnnouncementViewSet,
    RegisterView, IPOCreateView
)

router = DefaultRouter()
router.register('companies', CompanyViewSet)
router.register('ipos', IPOViewSet)
router.register('subscriptions', SubscriptionViewSet)
router.register('announcements', AnnouncementViewSet)

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('ipos/create/', IPOCreateView.as_view(), name='ipo-create'),
    path('', include(router.urls)),
]