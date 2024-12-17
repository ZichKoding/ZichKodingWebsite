from django.urls import path
from .views import ProjectListView, ProjectSearchView, ProjectTypeAheadView

urlpatterns = [
    path('', ProjectListView.as_view(), name='project-list'),
    path('search/', ProjectSearchView.as_view(), name='project-search'),
    path('search/typeahead/', ProjectTypeAheadView.as_view(), name='project-typeahead'),
]