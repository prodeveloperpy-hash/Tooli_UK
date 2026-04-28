from django.db import models

from tooli_uk_app.models.equipment import Equipment
from tooli_uk_app.models.location import Location


class EquipmentLocation(models.Model):
    equipment_location_id = models.AutoField(primary_key=True)
    equipment_id = models.ForeignKey(Equipment, on_delete=models.DO_NOTHING, db_column="equipment_id", related_name="locations")
    location_id = models.ForeignKey(Location, on_delete=models.DO_NOTHING, db_column="location_id", related_name="equipment_links")
    is_active = models.BooleanField(default=True, null=True, blank=True)
    created_datetime = models.DateTimeField(null=True, blank=True)

    class Meta:
        managed = False
        db_table = "equipment_location"
