from django.test import TestCase

from home.views import SummaryView
from home.models import Summary


class TestSummaryView(TestCase):
    def setUp(self):
        self.summary = Summary.objects.create(content="Test summary", is_active=True)
        self.summary2 = Summary.objects.create(content="Test summary 2", is_active=False)
        self.summary3 = Summary.objects.create(content="Test summary 3", is_active=True)

    def test_get_most_recent_active_summary(self):
        summary = SummaryView.get_most_recent_active_summary()
        self.assertEqual(summary, self.summary3)