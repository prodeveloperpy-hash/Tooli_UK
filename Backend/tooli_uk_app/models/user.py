from django.db import models

from tooli_uk_app.models.role import Role


class User(models.Model):
    user_id = models.AutoField(primary_key=True)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.CharField(max_length=150)
    password = models.CharField(max_length=255)
    avatar_url = models.TextField(null=True, blank=True)
    role_id = models.ForeignKey(Role, on_delete=models.DO_NOTHING, db_column="role_id", related_name="users")
    created_datetime = models.DateTimeField(null=True, blank=True)
    updated_datetime = models.DateTimeField(null=True, blank=True)
    created_by = models.ForeignKey("self", on_delete=models.DO_NOTHING, db_column="created_by", null=True, blank=True, related_name="created_users")
    updated_by = models.ForeignKey("self", on_delete=models.DO_NOTHING, db_column="updated_by", null=True, blank=True, related_name="updated_users")
    is_active = models.BooleanField(default=True, null=True, blank=True)

    class Meta:
        managed = False
        db_table = "user"
