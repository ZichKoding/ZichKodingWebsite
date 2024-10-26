from django.contrib import admin

from .models import Project


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ('title', 'description', 'url', 'gh_url', 'published_date')
    list_filter = ('published_date',)
    search_fields = ('title', 'description', 'url', 'gh_url')
    ordering = ('-published_date',)
    