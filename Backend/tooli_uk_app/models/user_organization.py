from django.db import models

from tooli_uk_app.models.organization import Organization
from tooli_uk_app.models.user import User


class UserOrganization(models.Model):
    user_organization_id = models.AutoField(primary_key=True)
    user_id = models.ForeignKey(User, on_delete=models.DO_NOTHING, db_column="user_id", related_name="organization_links")
    organization_id = models.ForeignKey(Organization, on_delete=models.DO_NOTHING, db_column="organization_id", related_name="user_links")
    role_id = models.CharField(max_length=100, null=True, blank=True)
    created_datetime = models.DateTimeField(null=True, blank=True)
    updated_datetime = models.DateTimeField(null=True, blank=True)
    created_by = models.ForeignKey(User, on_delete=models.DO_NOTHING, db_column="created_by", null=True, blank=True, related_name="user_organizations_created")
    updated_by = models.ForeignKey(User, on_delete=models.DO_NOTHING, db_column="updated_by", null=True, blank=True, related_name="user_organizations_updated")
    is_active = models.BooleanField(default=True, null=True, blank=True)

    class Meta:
        managed = False
        db_table = "user_organization"
