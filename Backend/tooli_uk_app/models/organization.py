from django.db import models

from tooli_uk_app.models.user import User


class Organization(models.Model):
    organization_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=200)
    domain = models.CharField(max_length=150, null=True, blank=True)
    logo = models.TextField(null=True, blank=True)
    address1 = models.CharField(max_length=255, null=True, blank=True)
    address2 = models.CharField(max_length=255, null=True, blank=True)
    city = models.CharField(max_length=150, null=True, blank=True)
    state = models.CharField(max_length=150, null=True, blank=True)
    postal_code = models.CharField(max_length=50, null=True, blank=True)
    country = models.CharField(max_length=100, null=True, blank=True)
    created_datetime = models.DateTimeField(null=True, blank=True)
    updated_datetime = models.DateTimeField(null=True, blank=True)
    created_by = models.ForeignKey(User, on_delete=models.DO_NOTHING, db_column="created_by", null=True, blank=True, related_name="organizations_created")
    updated_by = models.ForeignKey(User, on_delete=models.DO_NOTHING, db_column="updated_by", null=True, blank=True, related_name="organizations_updated")
    is_active = models.BooleanField(default=True, null=True, blank=True)

    class Meta:
        managed = False
        db_table = "organization"
