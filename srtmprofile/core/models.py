from django.contrib.gis.db import models


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

    @property
    def popup_content(self):
        popup = "<strong>Road: </strong>{}<br>".format(self.code)
        return popup

    class Meta:
        db_table = 'roads'
