from django.contrib import admin

from tooli_uk_app.models import Interval


@admin.register(Interval)
class IntervalAdmin(admin.ModelAdmin):
    list_display = ("interval_id", "interval_key", "interval_display_name")
    readonly_fields = ("interval_id",)
