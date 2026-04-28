from rest_framework import serializers

from tooli_uk_app.models import Category


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = "__all__"
        read_only_fields = ("category_id", "created_at")
