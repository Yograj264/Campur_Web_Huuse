from django.urls import path
from . import views, mobile_views

urlpatterns = [
    path('bootstrap/', views.bootstrap),
    path('action/', views.action),
    path('discussions/<slug:identifier>/answers/', views.answers),
    path('mobile/bootstrap/', mobile_views.bootstrap),
    path('mobile/action/', mobile_views.action),
    path('mobile/discussions/<slug:identifier>/answers/', mobile_views.answers),
]
