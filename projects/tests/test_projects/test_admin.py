from django.test import TestCase, Client
from django.urls import reverse
from django.contrib.auth.models import User

from projects.models import Project


class ProjectsAdminTest(TestCase):
    def setUp(self):
        # Create a superuser
        self.admin_user = User.objects.create_superuser(
            username='admin',
            email='admin@example.com',
            password='adminpass'
        )

        # Log the superuser in
        self.client = Client()
        self.client.login(username='admin', password='adminpass')

        # Create test data
        self.project = Project.objects.create(
            title='Test Project',
            description='A test project',
            content='A test project',
            image='projects/test.jpg',
            url='http://example.com',
            gh_url='http://github.com'
        )

    def test_projects_list(self):
        response = self.client.get(reverse('admin:projects_project_changelist'))
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, 'Test Project')

        # Check that the list_display fields are present
        self.assertContains(response, self.project.title)
        self.assertContains(response, self.project.description)
        self.assertContains(response, self.project.url)
        self.assertContains(response, self.project.gh_url)
        self.assertContains(response, self.project.published_date.strftime('%Y-%m-%d'))

    def test_projects_detail(self):
        response = self.client.get(reverse('admin:projects_project_change', args=[self.project.id]))

        self.assertEqual(response.status_code, 200)
        self.assertContains(response, 'Change project')
        self.assertContains(response, 'id_title')
        self.assertContains(response, 'id_description')
        self.assertContains(response, 'id_content')
        self.assertContains(response, 'id_image')
        self.assertContains(response, 'id_url')
        self.assertContains(response, 'id_gh_url')
        self.assertContains(response, 'Image preview')
        self.assertContains(response, 'Published date')

        