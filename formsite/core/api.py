from .models import Form
from rest_framework import serializers, viewsets, permissions, mixins, status
from rest_framework.response import Response
from .serializers import *

# Lead Viewset


class LeadViewSet(viewsets.ModelViewSet):
    permission_classes = [
        permissions.IsAuthenticated
    ]

    serializer_class = LeadSerializer

    def get_queryset(self):
        return self.request.user.leads.all()

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class FormViewSet(viewsets.ModelViewSet):
    permission_classes = [
        permissions.IsAuthenticatedOrReadOnly
    ]

    def get_queryset(self):
        return self.request.user.forms.all()

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user,
                        questions=self.request.data.get("questions"))

    def get_serializer_class(self):
        if ('pk' in self.kwargs) or self.request.method == "POST":
            return FullFormSerializer
        return BasicFormSerializer


class QuestionViewSet(mixins.CreateModelMixin, mixins.DestroyModelMixin, mixins.UpdateModelMixin, viewsets.GenericViewSet):
    permission_classes = [
        permissions.IsAuthenticated
    ]

    serializer_class = QuestionSerializer


class SubmissionViewSet(mixins.CreateModelMixin, mixins.RetrieveModelMixin, viewsets.GenericViewSet):
    permission_classes = [
        permissions.AllowAny
    ]

    def get_queryset(self):
        if 'pk' in self.kwargs:
            return Form.objects.filter(pk=self.kwargs["pk"])

    def perform_create(self, serializer):
        serializer.save(form=Form.objects.get(pk=self.request.data.get("form")), text_answers=self.request.data.get(
            "text_answers"), number_answers=self.request.data.get("number_answers"))

    def get_serializer_class(self):
        if self.request.method == "POST":
            return SubmitSubmissionSerializer
        return GuestFormSerializer
