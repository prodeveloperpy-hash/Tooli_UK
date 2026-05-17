from django.db import models


class Location(models.Model):
    location_id = models.AutoField(primary_key=True)
    city_name = models.CharField(max_length=150)
    country = models.CharField(max_length=100)
    state = models.CharField(max_length=100, null=True, blank=True)
    is_active = models.BooleanField(default=True, null=True, blank=True)
    created_datetime = models.DateTimeField(null=True, blank=True)
    order_by = models.IntegerField(null=True, blank=True)

    class Meta:
        managed = False
        db_table = "location"
        ordering = ["order_by"]

    def save(self, *args, **kwargs):
        # Ensure order_by is set and unique
        if self.order_by is None:
            max_order = Location.objects.aggregate(models.Max('order_by'))['order_by__max'] or 0
            self.order_by = max_order + 1
        else:
            Location.objects.filter(order_by=self.order_by).exclude(pk=self.pk).update(order_by=models.F('order_by') + 1)
        super().save(*args, **kwargs)
