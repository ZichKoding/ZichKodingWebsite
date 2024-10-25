from django.test import TestCase

from projects.models import Project

class TestProjectModel(TestCase):
    @classmethod
    def setUpTestData(cls):
        # Set up non-modified objects used by all test methods
        Project.objects.create(
            title="Test project", 
            description="Test description", 
            content="Test content", 
            url="https://www.test.com", 
            gh_url="https://www.github.com"
        )

    def test_title_label(self):
        project = Project.objects.get(id=1)
        field_label = project._meta.get_field('title').verbose_name
        self.assertEqual(field_label, 'title')

    def test_description_label(self):
        project = Project.objects.get(id=1)
        field_label = project._meta.get_field('description').verbose_name
        self.assertEqual(field_label, 'description')

    def test_content_label(self):
        project = Project.objects.get(id=1)
        field_label = project._meta.get_field('content').verbose_name
        self.assertEqual(field_label, 'content')

    def test_image_label(self):
        project = Project.objects.get(id=1)
        field_label = project._meta.get_field('image').verbose_name
        self.assertEqual(field_label, 'image')

    def test_url_label(self):
        project = Project.objects.get(id=1)
        field_label = project._meta.get_field('url').verbose_name
        self.assertEqual(field_label, 'url')

    def test_gh_url_label(self):
        project = Project.objects.get(id=1)
        field_label = project._meta.get_field('gh_url').verbose_name
        self.assertEqual(field_label, 'gh url')

    def test_published_date_label(self):
        project = Project.objects.get(id=1)
        field_label = project._meta.get_field('published_date').verbose_name
        self.assertEqual(field_label, 'published date')

    def test_title_max_length(self):
        project = Project.objects.get(id=1)
        max_length = project._meta.get_field('title').max_length
        self.assertEqual(max_length, 100)

    def test_description_text_field(self):
        project = Project.objects.get(id=1)
        self.assertTrue(isinstance(project.description, str))

    def test_content_text_field(self):
        project = Project.objects.get(id=1)
        self.assertTrue(isinstance(project.content, str))

    def test_published_date_auto_now_add(self):
        project = Project.objects.get(id=1)
        auto_now_add = project._meta.get_field('published_date').auto_now_add
        self.assertEqual(auto_now_add, True)

    def test_project_str_method(self):
        project = Project.objects.get(id=1)
        self.assertEqual(str(project), project.title)

    def test_image_upload_to(self):
        project = Project.objects.get(id=1)
        self.assertEqual(project.image.field.upload_to, 'projects/')

    def test_url_field(self):
        project = Project.objects.get(id=1)
        self.assertTrue(isinstance(project.url, str))

    def test_gh_url_field(self):
        project = Project.objects.get(id=1)
        self.assertTrue(isinstance(project.gh_url, str))