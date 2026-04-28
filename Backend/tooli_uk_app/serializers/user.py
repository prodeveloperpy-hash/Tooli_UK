from rest_framework import serializers

from tooli_uk_app.models import User


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = "__all__"
        read_only_fields = ("user_id", "created_datetime", "updated_datetime")
