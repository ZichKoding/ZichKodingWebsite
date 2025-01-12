from django.test import TestCase

from contact_me.models import Contact, Message


class TestContactModel(TestCase):
    def setUp(self):
        Contact.objects.create(
            first_name="Chris",
            last_name="Zichko",
            email="test@email.com"
        )
        
        Contact.objects.create(
            first_name="Chris",
            last_name="Zichko",
            email="test2@email.com"
        )

    def test_contact_model(self):
        contact = Contact.objects.get(email="test2@email.com")
        self.assertEqual(contact.first_name, "Chris")
        self.assertEqual(contact.last_name, "Zichko")
        self.assertEqual(contact.email, "test2@email.com")


class TestMessageModel(TestCase):
    def setUp(self):
        self.contact = Contact.objects.create(
            first_name="Chris",
            last_name="Zichko",
            email="test@email.com",
        )
        
        self.contact_id = self.contact.id

        Message.objects.create(
            message="This is a test message",
            project_url="http://www.test.com/test-project",
            project_title="Test Project",
            contact_id=self.contact
        )

        Message.objects.create(
            message="This is a test message for test project 2",
            project_url="http://www.test.com/test-project-2",
            project_title="Test Project 2",
            contact_id=self.contact
        )

    def test_message_model(self):
        message = Message.objects.get(project_title="Test Project")
        self.assertEqual(message.message, "This is a test message")
        self.assertEqual(message.project_url, "http://www.test.com/test-project")
        self.assertEqual(message.project_title, "Test Project")
        self.assertEqual(message.contact_id.id, self.contact_id)

        message2 = Message.objects.get(project_title="Test Project 2")
        self.assertEqual(message2.message, "This is a test message for test project 2")
        self.assertEqual(message2.project_url, "http://www.test.com/test-project-2")
        self.assertEqual(message2.project_title, "Test Project 2")
        self.assertEqual(message2.contact_id.id, self.contact_id)
        