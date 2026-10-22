from django.urls import path
from . import views
from . import management_views

urlpatterns = [path('bootstrap/', views.bootstrap, name='college-catalogue')]
urlpatterns += [
    path('admin/session/', management_views.admin_auth, {'action': 'session'}),
    path('admin/login/', management_views.admin_auth, {'action': 'login'}),
    path('admin/logout/', management_views.admin_auth, {'action': 'logout'}),
    path('admin/summary/', management_views.summary),
    path('admin/options/', management_views.options),
    path('admin/<str:resource>/', management_views.records),
    path('admin/<str:resource>/<str:record_id>/', management_views.records),
    path('roadmaps/', views.roadmaps),
]
from .auth_views import auth_api
urlpatterns += [path('auth/<str:action>/', auth_api, name='auth-api')]
from . import profile_views
urlpatterns += [path('profile/', profile_views.profile, name='student-profile'), path('profile/photo/', profile_views.photo, name='student-photo')]
urlpatterns += [path('profile/cover/', profile_views.cover, name='student-cover')]
from . import connect_views
urlpatterns += [path('community/', connect_views.community, name='community'), path('guidance/', connect_views.guidance, name='guidance')]
