from django.contrib import admin
from django.urls import path, include
from portal.views import index
urlpatterns = [path('admin/', admin.site.urls), path('api/', include('portal.urls')), path('', index, name='home')]
