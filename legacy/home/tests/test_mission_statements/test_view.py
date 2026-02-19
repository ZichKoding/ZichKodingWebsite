from django.test import TestCase

from home.views import MissionStatementView
from home.models import MissionStatement

class MissionStatementViewTest(TestCase):
    def setUp(self):
        # Create test data
        self.statement1 = MissionStatement.objects.create(
            mission_statement='To provide a platform for people to learn how to code.',
            is_active=True
        )
        self.statement2 = MissionStatement.objects.create(
            mission_statement='To share knowledge with others.',
            is_active=True
        )
        self.inactive_statement = MissionStatement.objects.create(
            mission_statement='This statement is inactive.',
            is_active=False
        )

    def test_get_random_mission_statement(self):
        mission_statement = MissionStatementView.get_random_mission_statement()
        self.assertIn(mission_statement, [self.statement1, self.statement2])
        self.assertNotEqual(mission_statement, self.inactive_statement)