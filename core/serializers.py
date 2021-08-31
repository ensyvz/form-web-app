import logging
from rest_framework import serializers
from .models import NumberAnswer, Lead, Question, Form, Submission, TextAnswer

# Lead Serializer


class LeadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lead
        fields = '__all__'


class TextAnswerSerializer(serializers.ModelSerializer):

    class Meta:
        model = TextAnswer
        fields = '__all__'


class NumberAnswerSerializer(serializers.ModelSerializer):

    class Meta:
        model = TextAnswer
        fields = '__all__'


class SubmissionSerializer(serializers.ModelSerializer):
    text_answers = TextAnswerSerializer(many=True, required=False)
    number_answers = NumberAnswerSerializer(many=True, required=False)

    class Meta:
        model = Submission
        fields = '__all__'


class QuestionSerializer(serializers.ModelSerializer):
    submissions = SubmissionSerializer(many=True, required=False)
    id = serializers.IntegerField(required=False)

    class Meta:
        model = Question
        fields = '__all__'


# import the logging library

# Get an instance of a logger
logger = logging.getLogger(__name__)


class FullFormSerializer(serializers.ModelSerializer):
    questions = QuestionSerializer(many=True, required=False)
    submissions = SubmissionSerializer(many=True, required=False)

    class Meta:
        model = Form
        fields = '__all__'

    def create(self, validated_data):
        questions = validated_data.pop("questions")
        form = Form.objects.create(**validated_data)
        for question in questions:
            question["form"] = form
            Question.objects.create(**question)

        return form

    def update(self, instance, validated_data):
        questions = validated_data.pop("questions")
        for question in questions:
            logger.error(Question.objects.filter(form=instance))
            if "id" in question:
                Question.objects.filter(id=question["id"]).update(**question)
            else:
                question["form"] = instance
                Question.objects.create(**question)

        def contains(list, filter):
            for x in list:
                if filter(x):
                    return True
            return False

        for question in Question.objects.filter(form=instance):
            logger.error(contains(Question.objects.all(),
                         lambda x: x.id == question.id))
            if not contains(Question.objects.all(), lambda x: x.id == question.id):
                Question.objects.filter(id=question.id).delete()
        return super().update(instance, validated_data)


class BasicFormSerializer(serializers.ModelSerializer):
    close_date = serializers.DateTimeField(format="%d-%m-%Y %H:%M")

    class Meta:
        model = Form
        fields = '__all__'


class GuestFormSerializer(serializers.ModelSerializer):
    questions = QuestionSerializer(many=True, required=False, read_only=True)
    close_date = serializers.DateTimeField(
        format="%d-%m-%Y %H:%M", read_only=True)

    class Meta:
        model = Form
        fields = '__all__'
        read_only_fields = ['owner', 'name', 'status', 'close_date']


class SubmitSubmissionSerializer(serializers.ModelSerializer):

    class Meta:
        model = Submission
        fields = '__all__'

    def create(self, validated_data):
        text_answers = validated_data.pop("text_answers")
        number_answers = validated_data.pop("number_answers")
        submission = Submission.objects.create(**validated_data)

        if text_answers:
            for text_answer in text_answers:
                text_answer["submission"] = submission
                text_answer["question"] = Question.objects.get(
                    pk=text_answer["question"])
                TextAnswer.objects.create(**text_answer)
        if number_answers:
            for number_answer in number_answers:
                number_answer["submission"] = submission
                number_answer["question"] = Question.objects.get(
                    pk=number_answer["question"])
                NumberAnswer.objects.create(**number_answer)

        return submission
