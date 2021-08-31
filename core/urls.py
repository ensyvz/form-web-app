from rest_framework import routers, urlpatterns
from .api import LeadViewSet, FormViewSet, QuestionViewSet, SubmissionViewSet

router = routers.DefaultRouter()
router.register('api/leads', LeadViewSet, 'leads')
router.register('api/forms', FormViewSet, 'forms')
router.register('api/questions', QuestionViewSet, 'questions')
router.register('api/submission', SubmissionViewSet, 'submission')

urlpatterns = router.urls
