from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PaymentViewSet, TokenViewSet, TokenTransactionViewSet, WithdrawalViewSet, TokenConversionViewSet

router = DefaultRouter()
router.register(r'payments', PaymentViewSet, basename='payment')
router.register(r'tokens', TokenViewSet, basename='token')
router.register(r'token-transactions', TokenTransactionViewSet, basename='token-transaction')
router.register(r'withdrawals', WithdrawalViewSet, basename='withdrawal')
router.register(r'token-conversions', TokenConversionViewSet, basename='token-conversion')

urlpatterns = [
    path('', include(router.urls)),
]

