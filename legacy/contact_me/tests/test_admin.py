from django.test import TestCase

from contact_me.models import Contact, Message
from contact_me.admin import ContactAdmin, MessageInline


class TestContactAdmin(TestCase):
    def setUp(self):
        # Create a contact objects for testing
        self.contact = Contact.objects.create(
            first_name="Chris",
            last_name="Zichko",
            email="test1@email.com"
        )

        self.contact2 = Contact.objects.create(
            first_name="Chris",
            last_name="Zichko",
            email="test2@email.com"
        )

        self.message1 = Message.objects.create(
            subject="Test Subject",
            message="This is a test message",
            project_url="http://www.test.com/test-project",
            project_title="Test Project",
            contact_id=self.contact
        )

        self.message2 = Message.objects.create(
            subject="Test Subject 2",
            message="This is a test message for test project 2",
            project_url="http://www.test.com/test-project-2",
            project_title="Test Project 2",
            contact_id=self.contact2
        )

    def test_contact_admin(self):
        '''
        Test that the contact admin is created correctly
        '''
        contact_admin = ContactAdmin(Contact, None)
        self.assertEqual(contact_admin.inlines, [MessageInline])
        self.assertEqual(contact_admin.list_display, ('first_name', 'last_name', 'email', 'acknowledged_count', 'unacknowledged_count'))
        self.assertEqual(contact_admin.search_fields, ['first_name', 'last_name', 'email'])
        self.assertEqual(contact_admin.list_filter, ['first_name', 'last_name', 'email'])
        self.assertEqual(contact_admin.ordering, ['first_name', 'last_name', 'email'])
        self.assertEqual(contact_admin.fields, ['first_name', 'last_name', 'email'])
        self.assertEqual(contact_admin.list_per_page, 10)
        self.assertEqual(contact_admin.actions, None)
        self.assertEqual(contact_admin.save_on_top, True)
        self.assertEqual(contact_admin.show_full_result_count, True)
        self.assertEqual(contact_admin.show_change_link, True)


    def test_contact_admin_search_fields(self):
        '''
        Test that the search fields are set correctly
        '''
        contact_admin = ContactAdmin(Contact, None)
        self.assertEqual(contact_admin.search_fields, ['first_name', 'last_name', 'email'])