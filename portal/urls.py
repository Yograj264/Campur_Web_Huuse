from django.urls import path
from . import views

urlpatterns = [path('bootstrap/', views.bootstrap, name='college-catalogue')]
from .auth_views import auth_api
urlpatterns += [path('auth/<str:action>/', auth_api, name='auth-api')]
