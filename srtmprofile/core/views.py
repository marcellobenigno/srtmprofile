from django.shortcuts import render
from djgeojson.views import GeoJSONLayerView

from .models import Road


def home(request):
    return render(request, 'home.html')


class RoadGeoJson(GeoJSONLayerView):
    model = Road
    simplify = 0.0001
    properties = ('popup_content', 'jurisdiction')


roads_geojson = RoadGeoJson.as_view()


# def home(request):

#     profile = DEM.profile.get(road_pk=1)

#     prof_dict = []

#     for obj in profile:

#         d = {
#             'id': obj.id,
#             'dist': int(obj.id * obj.length),
#             'elev': obj.elev,
#         }
#         prof_dict.append(d)

#     print(prof_dict)

#     context = {
#         'profile': prof_dict,
#     }

#     return render(request, 'home.html', context)
