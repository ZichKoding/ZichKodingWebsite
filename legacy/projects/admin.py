from django.contrib import admin
from django.utils.html import format_html

from .models import Project


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ('title', 'description', 'url', 'gh_url', 'published_date')
    list_filter = ('published_date',)
    search_fields = ('title', 'description', 'url', 'gh_url')
    ordering = ('-published_date',)
    fields = ('title', 'is_active', 'description', 'content', 'image_preview', 'image', 'url', 'gh_url', 'published_date')
    readonly_fields = ('published_date', 'image_preview')

    def image_preview(self, obj):
        if obj.image:
            return format_html('<img src="{}" style="max-height: 200px; max-width: 200px;" />'.format(obj.image.url))
        else:
            return 'No image'

    image_preview.short_description = 'Image preview'
    