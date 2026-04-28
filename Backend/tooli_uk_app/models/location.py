from django.db import models


class Location(models.Model):
    location_id = models.AutoField(primary_key=True)
    city_name = models.CharField(max_length=150)
    country = models.CharField(max_length=100)
    state = models.CharField(max_length=100, null=True, blank=True)
    is_active = models.BooleanField(default=True, null=True, blank=True)
    created_datetime = models.DateTimeField(null=True, blank=True)

    class Meta:
        managed = False
        db_table = "location"
