from django.test import TestCase

from home.models import MissionStatement


# Models
# MissionStatement model
class MissionStatementModelTest(TestCase):
    @classmethod
    def setUpTestData(cls):
        # Set up non-modified objects used by all test methods
        MissionStatement.objects.create(
            mission_statement='To provide a platform for people to learn how to code and to share their knowledge with others.'
        )
    
    def test_mission_statement_content_success(self):
        mission_statement = MissionStatement.objects.get(id=1)
        expected_object_name = f'{mission_statement.mission_statement}'
        self.assertEqual(
            expected_object_name, 
            'To provide a platform for people to learn how to code and to share their knowledge with others.'
        )

    def test_mission_statement_content_length(self):
        mission_statement = MissionStatement.objects.get(id=1)
        max_length = mission_statement._meta.get_field('mission_statement').max_length
        self.assertEqual(max_length, 250)