from django.db import models
from django.contrib.auth.models import User
# Create your models here.

# Lead Model


class Lead(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField(max_length=100, unique=True)
    message = models.CharField(max_length=500, blank=True)
    owner = models.ForeignKey(
        User, related_name="leads", on_delete=models.CASCADE, null=True)
    created_at = models.DateTimeField(auto_now_add=True)


class Form(models.Model):
    ACTIVE = 1
    INACTIVE = 0
    STATUS_CHOICES = [
        (ACTIVE, 'Active'),
        (INACTIVE, 'Inactive'),
    ]

    owner = models.ForeignKey(
        User, related_name="forms", on_delete=models.CASCADE, null=True)
    name = models.CharField(max_length=128)
    close_date = models.DateTimeField(blank=True, null=True)
    status = models.IntegerField(choices=STATUS_CHOICES)


class Question(models.Model):

    NUMBER = 'number'
    TEXT = 'text'
    DATA_TYPE_CHOICES = [
        (NUMBER, 'Number'),
        (TEXT, 'Text')
    ]

    title = models.CharField(max_length=1000)
    description = models.CharField(max_length=1000)
    form = models.ForeignKey(
        Form, related_name='questions', on_delete=models.CASCADE, null=True)
    data_type = models.CharField(
        max_length=8, choices=DATA_TYPE_CHOICES, default=TEXT)
    order = models.IntegerField()


class Submission(models.Model):

    submit_date = models.DateTimeField(auto_now_add=True)
    form = models.ForeignKey(
        Form, related_name='submissions', on_delete=models.CASCADE)


class Answer(models.Model):

    submission = models.ForeignKey(
        Submission, on_delete=models.CASCADE)
    question = models.ForeignKey(
        Question, on_delete=models.CASCADE)

    class Meta:
        abstract = True


class TextAnswer(Answer):
    answer = models.CharField(max_length=10000, blank=True)

    class Meta:
        default_related_name = 'text_answers'


class NumberAnswer(Answer):
    answer = models.IntegerField(blank=True)

    class Meta:
        default_related_name = 'number_answers'
