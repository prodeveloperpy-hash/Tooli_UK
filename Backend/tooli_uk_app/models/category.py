from django.db import models


class Category(models.Model):
    category_id = models.AutoField(primary_key=True)
    category_key = models.CharField(max_length=100, unique=True)
    category_display_name = models.CharField(max_length=150)
    is_active = models.BooleanField(default=True, null=True, blank=True)
    created_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        managed = False
        db_table = "category"
