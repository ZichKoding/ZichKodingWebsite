from django.test import TestCase

from home.models import Summary

class TestSummaryModel(TestCase):
    @classmethod
    def setUpTestData(cls):
        # Set up non-modified objects used by all test methods
        cls.summary = Summary.objects.create(
            content = "This is a summary of the website.",
            is_active=True
        )

    def test_summary_content_label(self):
        summary = Summary.objects.get(id=self.summary.id)
        field_label = summary._meta.get_field('content').verbose_name
        self.assertEqual(field_label, 'content')

    def test_summary_is_active_label(self):
        summary = Summary.objects.get(id=self.summary.id)
        field_label = summary._meta.get_field('is_active').verbose_name
        self.assertEqual(field_label, 'is active')

    def test_summary_published_date_label(self):
        summary = Summary.objects.get(id=self.summary.id)
        field_label = summary._meta.get_field('published_date').verbose_name
        self.assertEqual(field_label, 'published date')

    def test_summary_content_max_length(self):
        summary = Summary.objects.get(id=self.summary.id)
        max_length = summary._meta.get_field('content').max_length
        self.assertEqual(max_length, 500)

    def test_summary_is_active_default(self):
        summary = Summary.objects.get(id=self.summary.id)
        default = summary._meta.get_field('is_active').default
        self.assertEqual(default, True)

    def test_summary_published_date_auto_now_add(self):
        summary = Summary.objects.get(id=self.summary.id)
        auto_now_add = summary._meta.get_field('published_date').auto_now_add
        self.assertEqual(auto_now_add, True)

    def test_summary_str_method(self):
        summary = Summary.objects.get(id=self.summary.id)
        self.assertEqual(str(summary), summary.content)
