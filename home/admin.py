from django.contrib import admin

from home.models import MissionStatement

@admin.register(MissionStatement)
class MissionStatementAdmin(admin.ModelAdmin):
    list_display = ('mission_statement', 'is_active', 'published_date')
    list_filter = ('is_active', 'published_date')
    search_fields = ('mission_statement',)
    ordering = ('-published_date',)
    readonly_fields = ('published_date',)

