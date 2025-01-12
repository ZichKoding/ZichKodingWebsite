from django.contrib import admin

from .models import Contact, Message


class MessageInline(admin.TabularInline):
    model = Message
    extra = 0


@admin.register(Contact)
class ContactAdmin(admin.ModelAdmin):
    inlines = [MessageInline]
    list_display = ('first_name', 'last_name', 'email')
    search_fields = ['first_name', 'last_name', 'email']
    list_filter = ['first_name', 'last_name', 'email']
    ordering = ['first_name', 'last_name', 'email']
    fields = ['first_name', 'last_name', 'email']
    readonly_fields = ['first_name', 'last_name', 'email']
    list_per_page = 10
    actions = None
    save_on_top = True
    show_full_result_count = True
    show_change_link = True