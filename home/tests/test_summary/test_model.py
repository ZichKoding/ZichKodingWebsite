from django.test import TestCase

from home.models import Summary

class TestSummaryModel(TestCase):
    @classmethod
    def setUpTestData(cls):
        # Set up non-modified objects used by all test methods
        Summary.objects.create(
            content = "This is a summary of the website.",
            is_active=True
        )

    def test_summary_content_label(self):
        summary = Summary.objects.get(id=1)
        field_label = summary._meta.get_field('content').verbose_name
        self.assertEquals(field_label, 'content')

    def test_summary_is_active_label(self):
        summary = Summary.objects.get(id=1)
        field_label = summary._meta.get_field('is_active').verbose_name
        self.assertEquals(field_label, 'is active')

    def test_summary_published_date_label(self):
        summary = Summary.objects.get(id=1)
        field_label = summary._meta.get_field('published_date').verbose_name
        self.assertEquals(field_label, 'published date')

    def test_summary_content_max_length(self):
        summary = Summary.objects.get(id=1)
        max_length = summary._meta.get_field('content').max_length
        self.assertEquals(max_length, 500)

    def test_summary_is_active_default(self):
        summary = Summary.objects.get(id=1)
        default = summary._meta.get_field('is_active').default
        self.assertEquals(default, True)

    def test_summary_published_date_auto_now_add(self):
        summary = Summary.objects.get(id=1)
        auto_now_add = summary._meta.get_field('published_date').auto_now_add
        self.assertEquals(auto_now_add, True)

    def test_summary_str_method(self):
        summary = Summary.objects.get(id=1)
        self.assertEquals(str(summary), summary.content)
