from django.conf.urls import url

from . import views

app_name = 'core'
urlpatterns = [
    url(r'^$', views.home, name='home'),
    url(r'^roads.geojson$', views.roads_geojson, name='roads_geojson'),
]
