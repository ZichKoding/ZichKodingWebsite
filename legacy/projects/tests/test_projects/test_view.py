from datetime import timedelta
from unittest.mock import patch

from django.test import TestCase
from django.utils import timezone
from django.urls import reverse

from projects.models import Project
from projects.views import ProjectView


class TestProjectView(TestCase):
    def setUp(self):
        now = timezone.now()

        # Create projects with varying published_dates
        Project.objects.create(
            title='Test Project 1',
            description='Test Description 1',
            content='Test Content 1',
            image='projects/test1.jpg',
            url='https://test1.com',
            gh_url='https://github.com',
            is_active=True,
            published_date=now  # Most recent
        )
        Project.objects.create(
            title='Test Project 2',
            description='Test Description 2',
            content='Test Content 2',
            image='projects/test2.jpg',
            url='https://test2.com',
            gh_url='https://github.com',
            is_active=True,
            published_date=now - timedelta(days=1)
        )
        Project.objects.create(
            title='Test Project 3',
            description='Test Description 3',
            content='Test Content 3',
            image='projects/test3.jpg',
            url='https://test3.com',
            gh_url='https://github.com',
            is_active=True,
            published_date=now - timedelta(days=2)
        )
        Project.objects.create(
            title='Test Project 4',
            description='Test Description 4',
            content='Test Content 4',
            image='projects/test4.jpg',
            url='https://test4.com',
            gh_url='https://github.com',
            is_active=True,
            published_date=now - timedelta(days=3)
        )
        Project.objects.create(
            title='Test Project 5',
            description='Test Description 5',
            content='Test Content 5',
            image='projects/test5.jpg',
            url='https://test5.com',
            gh_url='https://github.com',
            is_active=True,
            published_date=now - timedelta(days=4)
        )
        Project.objects.create(
            title='Test Project 6',
            description='Test Description 6',
            content='Test Content 6',
            image='projects/test6.jpg',
            url='https://test6.com',
            gh_url='https://github.com',
            is_active=True,
            published_date=now - timedelta(days=5)
        )
        Project.objects.create(
            title='Test Project 7',
            description='Test Description 7',
            content='Test Content 7',
            image='projects/test7.jpg',
            url='https://test7.com',
            gh_url='https://github.com',
            is_active=True,
            published_date=now - timedelta(days=6)
        )
        Project.objects.create(
            title='Test Project 8',
            description='Test Description 8',
            content='Test Content 8',
            image='projects/test8.jpg',
            url='https://test8.com',
            gh_url='https://github.com',
            is_active=True,
            published_date=now - timedelta(days=7)
        )
        Project.objects.create(
            title='Test Project 9',
            description='Test Description 9',
            content='Test Content 9',
            image='projects/test9.jpg',
            url='https://test9.com',
            gh_url='https://github.com',
            is_active=True,
            published_date=now - timedelta(days=8)
        )
        Project.objects.create(
            title='Test Project 10',
            description='Test Description 10',
            content='Test Content 10',
            image='projects/test10.jpg',
            url='https://test10.com',
            gh_url='https://github.com',
            is_active=True,
            published_date=now - timedelta(days=9)
        )
        Project.objects.create(
            title='Testing Project',
            description='Testing Description',
            content='Testing Content',
            image='projects/testing.jpg',
            url='https://testing.com',
            gh_url='https://github.com',
            is_active=True,
            published_date=now - timedelta(days=10)
        )

    def test_get_three_random_active_projects(self):
        projects = ProjectView.get_three_random_active_projects()
        self.assertEqual(len(projects), 3)
        self.assertTrue(all(project.is_active for project in projects))

    def test_projects_page_loads_successfully(self):
        response = self.client.get('/projects/')
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, 'Search Projects')

    def test_search_project(self):
        """Test search returns correct JSON response"""
        response = self.client.get(reverse('project-search'), {'query': 'Test'})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response['Content-Type'], 'application/json')

        data = response.json()
        self.assertIn('results', data)
        self.assertGreater(len(data['results']), 0)

        # Check that the returned projects match the expected titles
        expected_titles = list(
            Project.objects.filter(
                title__icontains='Test',
                is_active=True
            ).order_by('-published_date').values_list('title', flat=True)
        )

        returned_titles = [project['title'] for project in data['results']]
        self.assertEqual(returned_titles, expected_titles[:len(returned_titles)])

    def test_project_search_type_ahead(self):
        """Test typeahead search returns 5 most recent projects matching query"""
        # First verify the published dates
        projects = Project.objects.all().order_by('-published_date')
        print("\nProject ordering check:")
        for p in projects[:5]:
            print(f"{p.title}: {p.published_date}")
            
        # Make the typeahead request
        response = self.client.get('/projects/search/typeahead/', {'query': 'tes'})
        self.assertEqual(response.status_code, 200)
        data = response.json()
        print(f"\nTypeahead response data: {data}")
        
        # Verify response structure
        self.assertIsInstance(data, list)
        self.assertLessEqual(len(data), 5)
        
        # Get actual titles from DB in correct order
        expected_titles = list(
            Project.objects.filter(
                title__icontains='tes',
                is_active=True
            ).order_by('-published_date')[:5].values_list('title', flat=True)
        )
        
        # Verify response matches DB query
        self.assertEqual(data, expected_titles)
        
    def test_projects_get_single_project_by_title(self):
        '''
        Testing get_single_project_by_title()
        '''
        title_to_get = 'test-project-2'
        # Expected should include all of the fields.
        expected = Project.objects.get(slug=title_to_get)
        
        model = ProjectView()
        actual = model.get_single_project_by_title(title_to_get)
        
        self.assertEqual(expected, actual)
        
    def test_projects_get_single_project_by_title_TypeError(self):
        '''
        Testing get_single_project_by_title() ability to handle a type error. 
        '''
        title_to_get = 12345
        model = ProjectView()
        expected = "`title` must be a string."
        
        with self.assertRaises(TypeError) as context:
            model.get_single_project_by_title(title_to_get)
        
        self.assertEqual(expected, str(context.exception))
        
    def test_projects_get_single_project_by_title_ValueError(self):
        '''
        Testing get_single_project_by_title() ability to handle a value error.
        '''
        title_to_get = "This is my project"
        
        expected = "The title is an invalid value."
        
        model = ProjectView()
        with self.assertRaises(ValueError) as context:
            model.get_single_project_by_title(title_to_get)
            
        self.assertEqual(expected, str(context.exception))
        
    def test_projects_get_single_project_by_title_TimeoutError(self):
        '''
        Testing get_single_project_by_title() ability to handle a timeout error.
        '''
        title_to_get = "Test Project 1"
        
        expected = "TimeoutError has occurred while retriveing the project. Please try again later or contact the administrator."
        
        model = ProjectView()
        with patch("projects.models.Project.objects.get", side_effect=TimeoutError):
            with self.assertRaises(TimeoutError) as context:
                model.get_single_project_by_title(title_to_get)
            
        self.assertEqual(expected, str(context.exception))

    def test_projects_get_single_project_by_title_Exception(self):
        '''
        Testing get_single_project_by_title() ability to handle an unexpected error.
        '''
        title_to_get = "Test Project 1"
        
        expected = f"An unexpected error occurred while searching for '{title_to_get}'."
        
        model = ProjectView()
        with patch("projects.models.Project.objects.get", side_effect=Exception):
            with self.assertRaises(Exception) as context:
                model.get_single_project_by_title(title_to_get)
            
        self.assertEqual(expected, str(context.exception))
