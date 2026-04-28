from django.db import models

from tooli_uk_app.models.equipment import Equipment
from tooli_uk_app.models.organization import Organization


class EquipmentImage(models.Model):
    equipment_image_id = models.AutoField(primary_key=True)
    equipment_id = models.ForeignKey(Equipment, on_delete=models.DO_NOTHING, db_column="equipment_id", related_name="images")
    image_url = models.TextField()
    is_active = models.BooleanField(default=True, null=True, blank=True)
    sort_order = models.IntegerField(default=0, null=True, blank=True)
    organization = models.ForeignKey(Organization, on_delete=models.DO_NOTHING, db_column="organization_id", null=True, blank=True, related_name="equipment_images")
    created_datetime = models.DateTimeField(null=True, blank=True)

    class Meta:
        managed = False
        db_table = "equipment_image"
