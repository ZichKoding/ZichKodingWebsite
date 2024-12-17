from django.db import models
from mdeditor.fields import MDTextField


class Project(models.Model):
    title = models.CharField(max_length=100)
    description = models.TextField()
    content = MDTextField(null=True, blank=True)
    image = models.ImageField(upload_to='projects/')
    url = models.URLField()
    gh_url = models.URLField()
    is_active = models.BooleanField(default=True)
    published_date = models.DateTimeField(auto_now_add=True, editable=False)

    def __str__(self):
        return self.title