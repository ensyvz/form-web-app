from django.urls import path, re_path
from . import views
urlpatterns = [
    path('', views.index),
    path('create', views.index),
    path('register', views.index),
    path('login', views.index),
    path('dashboard', views.index),
    re_path(r'^submit/(\d+)/?$', views.index),
    re_path(r'^dashboard/form/(\d+)/?$', views.index),
    re_path(r'^create/(\d+)/?$', views.index),
]
