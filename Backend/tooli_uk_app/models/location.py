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
        """Maintain unique order_by and swap when a target order already exists.

        * If order_by is None → assign next highest.
        * If order_by is set on **create** → shift others down.
        * If order_by is changed on **update** and another instance already has that order,
          swap the two values so the moved item takes the target position and the
          displaced item takes the original position.
        """
        if self.order_by is None:
            # New record without explicit order – place it at the end
            max_order = type(self).objects.aggregate(models.Max('order_by'))['order_by__max'] or 0
            self.order_by = max_order + 1
        else:
            if self.pk:
                # Existing record – fetch its previous order
                try:
                    original = type(self).objects.values('order_by').get(pk=self.pk)['order_by']
                except type(self).DoesNotExist:
                    original = None
                if original is not None and original != self.order_by:
                    # Check if another record already occupies the target order
                    target = type(self).objects.filter(order_by=self.order_by).exclude(pk=self.pk).first()
                    if target:
                        # Swap orders
                        target.order_by = original
                        target.save()
                    else:
                        # No conflict – shift surrounding records
                        if self.order_by > original:
                            type(self).objects.filter(order_by__gt=original, order_by__lte=self.order_by).exclude(pk=self.pk).update(order_by=models.F('order_by') - 1)
                        else:
                            type(self).objects.filter(order_by__lt=original, order_by__gte=self.order_by).exclude(pk=self.pk).update(order_by=models.F('order_by') + 1)
            else:
                # New record with explicit order – shift others down
                type(self).objects.filter(order_by__gte=self.order_by).update(order_by=models.F('order_by') + 1)
        super().save(*args, **kwargs)
