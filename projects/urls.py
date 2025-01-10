from django.urls import path
from .views import ProjectListView, ProjectSearchView, ProjectTypeAheadView, ProjectView

urlpatterns = [
    path('', ProjectListView.as_view(), name='project-list'),
    path('search/', ProjectSearchView.as_view(), name='project-search'),
    path('search/typeahead/', ProjectTypeAheadView.as_view(), name='project-typeahead'),
    path('project/<slug:slug>', ProjectView.get_single_project_by_title, name='project-details'),
]