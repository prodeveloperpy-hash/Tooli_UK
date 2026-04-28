from django.db import models

from tooli_uk_app.models.equipment import Equipment
from tooli_uk_app.models.interval import Interval
from tooli_uk_app.models.location import Location


class EquipmentPrice(models.Model):
    equipment_price_id = models.AutoField(primary_key=True)
    equipment_id = models.ForeignKey(Equipment, on_delete=models.DO_NOTHING, db_column="equipment_id", related_name="prices")
    location_id = models.ForeignKey(Location, on_delete=models.DO_NOTHING, db_column="location_id", null=True, blank=True, related_name="equipment_prices")
    is_active = models.BooleanField(default=True, null=True, blank=True)
    price = models.DecimalField(max_digits=12, decimal_places=2)
    interval_id = models.ForeignKey(Interval, on_delete=models.DO_NOTHING, db_column="interval_id", null=True, blank=True, related_name="equipment_prices")
    currency = models.CharField(max_length=10)
    created_datetime = models.DateTimeField(null=True, blank=True)

    class Meta:
        managed = False
        db_table = "equipment_price"
