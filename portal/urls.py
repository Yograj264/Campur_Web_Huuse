from django.urls import path
from . import views
urlpatterns = [path('bootstrap/',views.bootstrap),path('action/',views.action),path('discussions/<slug:identifier>/answers/',views.answers)]
