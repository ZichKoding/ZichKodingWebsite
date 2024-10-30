from django.test import TestCase, Client
from django.urls import reverse

from home.models import MissionStatement, Summary
from projects.models import Project

class TestHomeViews(TestCase):
    def setUp(self):
        self.client = Client()
        self.mission_statement = MissionStatement.objects.create(
            mission_statement='Test Mission Statement',
            is_active=True
        )
        self.summary = Summary.objects.create(
            content='Test Content',
            is_active=True
        )
        self.project = Project.objects.create(
            title='Test Project',
            description='Test Description',
            content='Test Content',
            image='projects/test.jpg',
            url='http://www.test.com',
            gh_url='http://www.github.com/test',
            is_active=True
        )

    def test_get_home_page(self):
        response = self.client.get(reverse('home'))
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'home/index.html')
        self.assertContains(response, self.mission_statement.mission_statement)
        self.assertContains(response, self.summary.content)
        self.assertContains(response, self.project.title)