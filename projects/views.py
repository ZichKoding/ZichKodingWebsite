from django.http import JsonResponse
from django.views import View
from django.shortcuts import render
from projects.models import Project
import random

class ProjectView:
    @staticmethod
    def get_three_random_active_projects():
        active_projects = list(Project.objects.filter(is_active=True))
        if len(active_projects) >= 3:
            return random.sample(active_projects, 3)
        return active_projects

class ProjectListView(View):
    def get(self, request):
        projects = ProjectView.get_three_random_active_projects()
        return render(request, 'projects/projects.html', {'projects': projects})

class ProjectSearchView(View):
    def get(self, request):
        query = request.GET.get('query', '')
        projects = Project.objects.filter(title__icontains=query, is_active=True)
        return render(request, 'projects/search_results.html', {'projects': projects})

class ProjectTypeAheadView(View):
    def get(self, request):
        query = request.GET.get('query', '')
        projects = Project.objects.filter(title__icontains=query, is_active=True)[:5]
        project_titles = list(projects.values_list('title', flat=True))
        return JsonResponse(project_titles, safe=False)