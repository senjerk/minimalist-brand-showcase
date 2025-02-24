import django.conf
import django.conf.urls.static
import django.contrib.admin
import django.urls
from django.conf import settings
from django.conf.urls.static import static
from django.urls import path, include


urlpatterns = [
    django.urls.path(
        "admin/",
        django.contrib.admin.site.urls,
        name="admin",
    ),
    django.urls.path(
        "api/",
        django.urls.include("api.urls"),
        name="api",
    ),
]

# Обрабатываем медиа файлы всегда, а не только в DEBUG
if settings.MEDIA_ROOT:
    urlpatterns += static(
        settings.MEDIA_URL,
        document_root=settings.MEDIA_ROOT,
    )
