from django.db import models


class Category(models.Model):
    category_id = models.AutoField(primary_key=True)
    category_key = models.CharField(max_length=100, unique=True)
    category_display_name = models.CharField(max_length=150)
    is_active = models.BooleanField(default=True, null=True, blank=True)
    created_at = models.DateTimeField(null=True, blank=True)
from django.db import models


class Category(models.Model):
    category_id = models.AutoField(primary_key=True)
    category_key = models.CharField(max_length=100, unique=True)
    category_display_name = models.CharField(max_length=150)
    is_active = models.BooleanField(default=True, null=True, blank=True)
    created_at = models.DateTimeField(null=True, blank=True)
    order_by=models.IntegerField(null=True, blank=True)
    class Meta:
        managed = False
        db_table = "category"
        ordering = ["order_by"]

    def save(self, *args, **kwargs):
        # Ensure order_by is set and unique
        if self.order_by is None:
            # Auto‑increment if no order provided
            max_order = Category.objects.aggregate(models.Max('order_by'))['order_by__max'] or 0
            self.order_by = max_order + 1
        else:
            # Determine if this is a create or update
            if self.pk:
                # Existing record – fetch original order
                try:
                    original = Category.objects.values('order_by').get(pk=self.pk)['order_by']
                except Category.DoesNotExist:
                    original = None
                if original is not None and original != self.order_by:
                    if self.order_by > original:
                        # Moving down: shift up records in the gap
                        Category.objects.filter(order_by__gt=original, order_by__lte=self.order_by).exclude(pk=self.pk).update(order_by=models.F('order_by') - 1)
                    else:
                        # Moving up: shift down records in the gap
                        Category.objects.filter(order_by__lt=original, order_by__gte=self.order_by).exclude(pk=self.pk).update(order_by=models.F('order_by') + 1)
                # If order unchanged, nothing to shift
            else:
                # New record with explicit order – shift others down
                Category.objects.filter(order_by__gte=self.order_by).update(order_by=models.F('order_by') + 1)
        super().save(*args, **kwargs)
