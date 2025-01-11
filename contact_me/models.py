from django.db import models


class Contact(models.Model):
    first_name = models.CharField(blank=True, max_length=50)
    last_name = models.CharField(blank=True, max_length=50)
    email = models.EmailField(unique=True, max_length=255)
    message = models.TextField(max_length=1000)
    project_url = models.URLField()
    project_title = models.CharField(blank=True, max_length=100)
    