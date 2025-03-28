from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView
from .views import UserViewSet, LawyerProfileViewSet, NGOProfileViewSet, DonorProfileViewSet

router = DefaultRouter()
router.register(r'', UserViewSet)
router.register(r'lawyers', LawyerProfileViewSet)
router.register(r'ngos', NGOProfileViewSet)
router.register(r'donors', DonorProfileViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]

