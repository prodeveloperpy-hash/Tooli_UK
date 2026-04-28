from django.db import models

from tooli_uk_app.models.equipment import Equipment


class EquipmentAvailability(models.Model):
    equipment_availability_id = models.AutoField(primary_key=True)
    equipment_id = models.ForeignKey(Equipment, on_delete=models.DO_NOTHING, db_column="equipment_id", related_name="availabilities")
    availability_from = models.DateTimeField()
    availability_to = models.DateTimeField()
    is_active = models.BooleanField(default=True, null=True, blank=True)
    created_datetime = models.DateTimeField(null=True, blank=True)

    class Meta:
        managed = False
        db_table = "equipment_availability"
