from django.test import TestCase, Client
from django.urls import reverse
from django.contrib.auth.models import User

from home.models import MissionStatement


# Admin
class MissionStatementAdminTest(TestCase):
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
        self.statement = 'To provide a platform for people to learn how to code and to share their knowledge with others.'
        self.mission_statement = MissionStatement.objects.create(
            mission_statement= self.statement,
            is_active=True
        )

    def test_mission_statement_admin_list_view(self):
        response = self.client.get(reverse('admin:home_missionstatement_changelist'))
        
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, self.statement)

        # Check that the list_display fields are present
        self.assertContains(response, self.mission_statement.mission_statement)
        self.assertContains(response, 'Yes' if self.mission_statement.is_active else 'No')
        self.assertContains(response, self.mission_statement.published_date.strftime('%Y-%m-%d'))

    def test_mission_statement_admin_detail_view(self):
        response = self.client.get(reverse('admin:home_missionstatement_change', args=[self.mission_statement.id]))

        self.assertEqual(response.status_code, 200)
        self.assertContains(response, 'Change mission statement')
        self.assertContains(response, 'id_mission_statement')
        self.assertContains(response, 'id_is_active')
        self.assertContains(response, 'Published date')

    def test_mission_statement_admin_fields(self):
        from home.admin import MissionStatementAdmin
        from django.contrib.admin.sites import AdminSite

        admin_site = AdminSite()
        ma = MissionStatementAdmin(MissionStatement, admin_site)

        self.assertEqual(ma.list_display, ('mission_statement', 'is_active', 'published_date'))

        self.assertEqual(ma.list_filter, ('is_active', 'published_date'))
        self.assertEqual(ma.search_fields, ('mission_statement',))