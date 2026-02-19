from django.test import TestCase, Client
from django.urls import reverse
from django.contrib.auth.models import User

from home.models import Summary


class SummaryAdminTest(TestCase):
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
        self.content = 'To provide a platform for people to learn how to code and to share their knowledge with others.'
        self.summary = Summary.objects.create(
            content=self.content,
            is_active=True
        )

    def test_summary_admin_list_view(self):
        response = self.client.get(reverse('admin:home_summary_changelist'))
        
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, self.content)

        # Check that the list_display fields are present
        self.assertContains(response, self.summary.content)
        self.assertContains(response, 'Yes' if self.summary.is_active else 'No')
        self.assertContains(response, self.summary.published_date.strftime('%Y-%m-%d'))

    def test_summary_admin_detail_view(self):
        response = self.client.get(reverse('admin:home_summary_change', args=[self.summary.id]))

        self.assertEqual(response.status_code, 200)
        self.assertContains(response, 'Change summary')
        self.assertContains(response, 'id_content')
        self.assertContains(response, 'id_is_active')
        self.assertContains(response, 'Published date')

    def test_summary_admin_fields(self):
        from home.admin import SummaryAdmin
        from django.contrib.admin.sites import AdminSite

        admin_site = AdminSite()
        sa = SummaryAdmin(Summary, admin_site)

        self.assertEqual(sa.list_display, ('content', 'is_active', 'published_date'))

        self.assertEqual(sa.list_filter, ('is_active', 'published_date'))
        self.assertEqual(sa.search_fields, ('content',))