from django.contrib import admin
from django.urls import path, include
from portal.views import index
urlpatterns = [
    path('admin/', index, name='custom-admin'),
    path('admin/login/', index, name='custom-admin-login'),
    path('admin/<path:section>/', index, name='custom-admin-section'),
    path('django-admin/', admin.site.urls),
    path('api/', include('portal.urls')),
    path('', index, name='home'),
]
