import json

from django.shortcuts import render, get_object_or_404
from djgeojson.views import GeoJSONLayerView

from .models import DEM, Road


def home(request):
    return render(request, 'home.html')


class RoadGeoJson(GeoJSONLayerView):
    model = Road
    simplify = 0.0001
    properties = ('popup_content', 'jurisdiction')


roads_geojson = RoadGeoJson.as_view()


def detail(request, pk):
    road = get_object_or_404(Road, pk=pk)
    profile = DEM.profile.get(road_pk=pk)
    distance = [int(obj.id * obj.length) for obj in profile]
    elevation = [obj.elev for obj in profile]

    length = int(profile[20].length * 20) / 1000

    init_x = profile[0].x
    init_y = profile[0].y

    end_x = profile[20].x
    end_y = profile[20].y

    context = {
        'distance': json.dumps(distance),
        'elevation': json.dumps(elevation),
        'obj': road,
        'init_x': init_x,
        'init_y': init_y,
        'end_x': end_x,
        'end_y': end_y,
        'length': length,
    }

    return render(request, 'detail.html', context)
