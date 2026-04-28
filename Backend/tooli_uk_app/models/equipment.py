from django.db import models

from tooli_uk_app.models.category import Category
from tooli_uk_app.models.organization import Organization
from tooli_uk_app.models.user import User


class Equipment(models.Model):
    equipment_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=200)
    description = models.TextField(null=True, blank=True)
    is_active = models.BooleanField(default=True, null=True, blank=True)
    category_id = models.ForeignKey(Category, on_delete=models.DO_NOTHING, db_column="category_id", null=True, blank=True, related_name="equipment_items")
    organization_id = models.ForeignKey(Organization, on_delete=models.DO_NOTHING, db_column="organization_id", null=True, blank=True, related_name="equipment_items")
    created_datetime = models.DateTimeField(null=True, blank=True)
    updated_datetime = models.DateTimeField(null=True, blank=True)
    created_by = models.ForeignKey(User, on_delete=models.DO_NOTHING, db_column="created_by", null=True, blank=True, related_name="equipment_created")
    updated_by = models.ForeignKey(User, on_delete=models.DO_NOTHING, db_column="updated_by", null=True, blank=True, related_name="equipment_updated")

    class Meta:
        managed = False
        db_table = "equipment"
