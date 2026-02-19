from django.shortcuts import render
from django.views import View
from home.models import MissionStatement, Summary
from projects.views import ProjectView


class MissionStatementView:
    @staticmethod
    def get_random_mission_statement():
        mission_statement = MissionStatement.objects.filter(is_active=True).order_by('?').first()
        return mission_statement

class SummaryView:
    @staticmethod
    def get_most_recent_active_summary():
        summary = Summary.objects.filter(is_active=True).order_by('-published_date').first()
        return summary

class HomeView(View):
    def get(self, request):
        mission_statement = MissionStatementView.get_random_mission_statement()
        summary = SummaryView.get_most_recent_active_summary()
        projects = ProjectView.get_three_random_active_projects()
        return render(request, 'home/index.html', {'mission_statement': mission_statement, 'summary': summary, 'projects': projects}, status=200)