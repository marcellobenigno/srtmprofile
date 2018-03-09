from django.conf import settings
from django.contrib import admin
from django.conf.urls.static import static
from django.urls import include, path


urlpatterns = [
    path(r'', include('srtmprofile.core.urls', namespace='core')),
    path('admin/', admin.site.urls),
]

if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
