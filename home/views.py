from django.shortcuts import render

from home.models import MissionStatement, Summary

class MissionStatementView:
    def get_random_mission_statement():
        mission_statement = MissionStatement.objects.filter(is_active=True).order_by('?').first()
        return mission_statement
    

class SummaryView:
    def get_most_recent_active_summary():
        summary = Summary.objects.filter(is_active=True).order_by('-published_date').first()
        return summary