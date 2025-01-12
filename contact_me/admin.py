from django.contrib import admin

from .models import Contact, Message


class MessageInline(admin.TabularInline):
    model = Message
    extra = 0
    show_change_link = True
    fields = ('acknowledged', 'subject', 'project_title', 'submitted_at')
    readonly_fields = ['submitted_at']
    

@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    list_display = ('acknowledged', 'subject', 'project_title', 'contact_id', 'submitted_at')
    search_fields = ['subject', 'project_title', 'contact_id__email']
    list_filter = ['acknowledged', 'subject', 'project_title', 'contact_id__email']
    ordering = ['acknowledged', 'subject', 'project_title', 'contact_id', 'submitted_at']
    fields = ['acknowledged', 'subject', 'message', 'project_url', 'project_title', 'contact_id', 'submitted_at']
    readonly_fields = ['submitted_at']
    list_per_page = 10
    actions = None
    save_on_top = True
    show_full_result_count = True
    show_change_link = True


@admin.register(Contact)
class ContactAdmin(admin.ModelAdmin):
    inlines = [MessageInline]
    list_display = ('first_name', 'last_name', 'email', 'acknowledged_count', 'unacknowledged_count')
    search_fields = ['first_name', 'last_name', 'email']
    list_filter = ['first_name', 'last_name', 'email']
    ordering = ['first_name', 'last_name', 'email']
    fields = ['first_name', 'last_name', 'email']
    list_per_page = 10
    actions = None
    save_on_top = True
    show_full_result_count = True
    show_change_link = True

    def acknowledged_count(self, obj):
        return obj.messages.filter(acknowledged=True).count()
    acknowledged_count.short_description = 'Acknowledged Messages'

    def unacknowledged_count(self, obj):
        return obj.messages.filter(acknowledged=False).count()
    unacknowledged_count.short_description = 'Unacknowledged Messages'
