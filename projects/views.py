from django.shortcuts import render

from projects.models import Project


class ProjectView:
    @staticmethod
    def get_three_random_active_projects():
        random_projects = Project.objects.filter(is_active=True).order_by('?')[:3]
        return random_projects