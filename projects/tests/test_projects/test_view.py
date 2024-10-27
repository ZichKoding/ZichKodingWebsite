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
            )
        ])


    def test_get_three_random_active_projects(self):
        projects = ProjectView.get_three_random_active_projects()
        self.assertEqual(len(projects), 3)
        self.assertTrue(all(project.is_active for project in projects))