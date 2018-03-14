from django.contrib.gis.db import models
from django.urls import reverse


class ProfileManager(models.Manager):

    def get(self, road_pk):
        sql = """
          WITH points AS (
              SELECT
                id,
                ST_Length(geom :: GEOGRAPHY)/20.0 length,
                ST_LineInterpolatePoint(geom, id / 20.0) geom
              FROM generate_series(0, 20) id,
                (SELECT (ST_Dump(geom)).geom
                 FROM roads
                 WHERE id = {}) foo)
              SELECT
                points.id,
                ST_X(geom) x,
                ST_Y(geom) y,
                length,
                ST_Value(rast, geom) :: INTEGER elev
              FROM points, dem
              WHERE ST_Intersects(rast, geom)
              """.format(road_pk)
        return super(ProfileManager, self).get_queryset().raw(sql)


class DEM(models.Model):
    rast = models.RasterField()

    class Meta:
        db_table = 'dem'

    objects = models.Manager()

    profile = ProfileManager()


class Road(models.Model):
    code = models.CharField('código', unique=True, max_length=50)
    geom = models.MultiLineStringField('geom', srid=4326)

    def __str__(self):
        return self.code

    def get_absolute_url(self):
        return reverse('core:detail', args=[str(self.id)])

    @property
    def jurisdiction(self):
        if self.code[0:2] == 'BR':
            return 'Federal'
        return 'Estadual'

    @property
    def popup_content(self):
        popup = "<strong>Trecho: </strong>{}<br>".format(self.code)
        popup += "<strong>Jurisdição: </strong>{}<br>".format(
            self.jurisdiction)
        popup += "<a href='{}'>+ info</a>".format(self.get_absolute_url())
        return popup

    class Meta:
        db_table = 'roads'
