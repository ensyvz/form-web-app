from django.shortcuts import render


def index(request, route=None):
    return render(request, 'frontend/index.html')
