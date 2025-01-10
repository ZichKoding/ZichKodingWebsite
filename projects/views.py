import random
import logging

from django.http import JsonResponse
from django.views import View
from django.shortcuts import render

from projects.models import Project


logging.basicConfig(level=logging.DEBUG)

class ProjectView:
    @staticmethod
    def get_three_random_active_projects():
        active_projects = list(Project.objects.filter(is_active=True))
        if len(active_projects) >= 3:
            return random.sample(active_projects, 3)
        return active_projects
        
    def get_single_project_by_title(title):
        '''
        This method will get a project's
        details to display on a separate page.
        Args:
            :title: String value for the title of the project. 
            
        Returns:
            Returns an object of all the fields necessary for a single project view.
            
        Raises:
            TypeError if the title is not a string.
            ValueError if the title doesn't exist in the database. 
            TimeoutError if the query timed out before satisfying the request. 
            Exception if an error occurred that's out of scope for the 3 listed above. 
        '''
        logging.info(f"Verifying type of the title({title})...")
        if isinstance(title, str) is False:
            raise TypeError("`title` must be a string.")
        
        try:
            logging.info("Attempting to retrieve the project...")
            single_project = Project.objects.get(title=title)
            logging.info("Returning the project...")
            return single_project
        except Project.DoesNotExist:
            logging.error(f"Project does not exist '{title}'")
            raise ValueError("The title is an invalid value.")
        except TimeoutError:
            logging.error(f"Timeout occurred while searching for '{title}'")
            raise TimeoutError("TimeoutError has occurred while retriveing the project. Please try again later or contact the administrator.")
        except Exception as e:
            logging.error(f"An unexpected error has occurred: {e}")
            raise Exception(f"An unexpected error occurred while searching for '{title}'.")


class ProjectListView(View):
    def get(self, request):
        # Order projects by published_date descending (newest first)
        projects = Project.objects.filter(is_active=True).order_by('-published_date')
        return render(request, 'projects/projects.html', {'projects': projects})

class ProjectSearchView(View):
    def get(self, request):
        query = request.GET.get('query', '')
        projects = Project.objects.filter(title__icontains=query, is_active=True).order_by('-published_date')
        
        # Prepare the JSON response
        results = []
        for project in projects:
            results.append({
                'title': project.title,
                'description': project.description[:200] + '...',  # Truncate description if necessary
                'url': project.url,  # Ensure get_absolute_url is defined
            })
        
        return JsonResponse({'results': results})

class ProjectTypeAheadView(View):
    def get(self, request):
        query = request.GET.get('query', '')
        projects = Project.objects.filter(
            title__icontains=query,
            is_active=True
        ).order_by('-published_date')[:5]  # Ensure descending order
        project_titles = list(projects.values_list('title', flat=True))
        return JsonResponse(project_titles, safe=False)