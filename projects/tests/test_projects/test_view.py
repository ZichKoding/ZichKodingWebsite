from django.test import TestCase

from projects.models import Project
from projects.views import ProjectView


class TestProjectView(TestCase):
    def setUp(self):
        self.projects = Project.objects.bulk_create([
            Project(
                title='Test Project 1',
                description='Test Description 1',
                content='Test Content 1',
                image='projects/test1.jpg',
                url='https://test1.com',
                gh_url='https://github.com',
                is_active=True
            ),
            Project(
                title='Test Project 2',
                description='Test Description 2',
                content='Test Content 2',
                image='projects/test2.jpg',
                url='https://test2.com',
                gh_url='https://github.com',
                is_active=True
            ),
            Project(
                title='Test Project 3',
                description='Test Description 3',
                content='Test Content 3',
                image='projects/test3.jpg',
                url='https://test3.com',
                gh_url='https://github.com',
                is_active=True
            ),
            Project(
                title='Test Project 4',
                description='Test Description 4',
                content='Test Content 4',
                image='projects/test4.jpg',
                url='https://test4.com',
                gh_url='https://github.com',
                is_active=True
            ),
            Project(
                title='Test Project 5',
                description='Test Description 5',
                content='Test Content 5',
                image='projects/test5.jpg',
                url='https://test5.com',
                gh_url='https://github.com',
                is_active=False
            ),
            Project(
                title='Test Project 6',
                description='Test Description 6',
                content='Test Content 6',
                image='projects/test6.jpg',
                url='https://test6.com',
                gh_url='https://github.com',
                is_active=False
            ),
            Project(
                title='Test Project 7',
                description='Test Description 7',
                content='Test Content 7',
                image='projects/test7.jpg',
                url='https://test7.com',
                gh_url='https://github.com',
                is_active=True
            ),
            Project(
                title='Test Project 8',
                description='Test Description 8',
                content='Test Content 8',
                image='projects/test8.jpg',
                url='https://test8.com',
                gh_url='https://github.com',
                is_active=True
            ),
            Project(
                title='Test Project 9',
                description='Test Description 9',
                content='Test Content 9',
                image='projects/test9.jpg',
                url='https://test9.com',
                gh_url='https://github.com',
                is_active=True
            ),
            Project(
                title='Test Project 10',
                description='Test Description 10',
                content='Test Content 10',
                image='projects/test10.jpg',
                url='https://test10.com',
                gh_url='https://github.com',
                is_active=True
            ),
            Project(
                title='Testing Project',
                description='Testing Description',
                content='Testing Content',
                image='projects/testing.jpg',
                url='https://testing.com',
                gh_url='https://github.com',
                is_active=True
            )
        ])


    def test_get_three_random_active_projects(self):
        projects = ProjectView.get_three_random_active_projects()
        self.assertEqual(len(projects), 3)
        self.assertTrue(all(project.is_active for project in projects))

    def test_projects_page_loads_successfully(self):
        response = self.client.get('/projects/')
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, 'Search Projects')

    def test_search_project(self):
        response = self.client.get('/projects/search/', {'query': 'Test'})
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, 'Test Project 1')
        self.assertContains(response, 'Test Project 2')
        self.assertContains(response, 'Testing Project')

    def test_project_search_type_ahead(self):
        response = self.client.get('/projects/search/typeahead/', {'query': 'Tes'})
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIsInstance(data, list)
        self.assertGreaterEqual(len(data), 2)
        self.assertIn('Test Project 1', data)
        self.assertIn('Test Project 2', data)