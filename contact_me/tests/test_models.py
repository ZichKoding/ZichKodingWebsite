from django.test import TestCase

from contact_me.models import Contact 


class TestContactModel(TestCase):
    def setUp(self):
        Contact.objects.create(
            first_name="Chris",
            last_name="Zichko",
            email="test@email.com",
            message="I'm adding a message to be sent to the administrator here.",
            project_url="",
            project_title="Test Project 1"
        )
        
        Contact.objects.create(
            first_name="Chris",
            last_name="Zichko",
            email="test@email.com",
            message="I'm adding a message to be sent to the administrator here.",
            project_url="https://zichkoding.com/project/test-project-1",
            project_title=""
        )