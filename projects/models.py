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
    published_date = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ['-published_date']

    def __str__(self):
        return self.title