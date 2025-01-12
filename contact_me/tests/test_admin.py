from django.test import TestCase

from contact_me.models import Contact, Message
from contact_me.admin import ContactAdmin


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
            message="This is a test message",
            project_url="http://www.test.com/test-project",
            project_title="Test Project",
            contact_id=self.contact
        )

        self.message2 = Message.objects.create(
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
        self.assertEqual(contact_admin.get_queryset(None).count(), 2)
        self.assertEqual(contact_admin.get_queryset(None)[0].email, self.contact.email)
        self.assertEqual(contact_admin.get_queryset(None)[1].email, self.contact2.email)
        self.assertEqual(contact_admin.get_queryset(None)[0].first_name, self.contact.first_name)
        self.assertEqual(contact_admin.get_queryset(None)[1].first_name, self.contact2.first_name)
        