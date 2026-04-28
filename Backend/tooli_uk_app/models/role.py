from django.db import models


class Role(models.Model):
    role_id = models.AutoField(primary_key=True)
    role_key = models.CharField(max_length=50, unique=True)
    role_display_name = models.CharField(max_length=100)

    class Meta:
        managed = False
        db_table = "role"
