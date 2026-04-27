from django.db import models


class Interval(models.Model):
    """Maps to portal.interval (identity PK, nullable key/display)."""

    interval_id = models.AutoField(primary_key=True)
    interval_key = models.CharField(max_length=100, null=True, blank=True)
    interval_display_name = models.CharField(max_length=100, null=True, blank=True)

    class Meta:
        managed = False
        db_table = "interval"
