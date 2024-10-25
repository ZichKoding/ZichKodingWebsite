from django.shortcuts import render

from home.models import MissionStatement

class MissionStatementView:
    def get_random_mission_statement():
        mission_statement = MissionStatement.objects.filter(is_active=True).order_by('?').first()
        return mission_statement