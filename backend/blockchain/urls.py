from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    BlockchainTransactionViewSet, EscrowContractViewSet,
    TokenBalanceViewSet, TokenTransactionViewSet
)

router = DefaultRouter()
router.register(r'transactions', BlockchainTransactionViewSet)
router.register(r'escrows', EscrowContractViewSet)
router.register(r'token-balances', TokenBalanceViewSet)
router.register(r'token-transactions', TokenTransactionViewSet)

urlpatterns = [
    path('', include(router.urls)),
]

