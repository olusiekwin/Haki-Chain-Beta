from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import BountyViewSet, MilestoneViewSet, BountyDocumentViewSet, ReviewViewSet

router = DefaultRouter()
router.register(r'', BountyViewSet)
router.register(r'milestones', MilestoneViewSet)
router.register(r'documents', BountyDocumentViewSet)
router.register(r'reviews', ReviewViewSet)

urlpatterns = [
    path('', include(router.urls)),
]

