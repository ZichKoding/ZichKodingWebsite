from django.db import models


class Project(models.Model):
    title = models.CharField(max_length=100)
    description = models.TextField()
    content = models.TextField()
    image = models.ImageField(upload_to='projects/')
    url = models.URLField()
    gh_url = models.URLField()
    published_date = models.DateTimeField(auto_now_add=True, editable=False)

    def __str__(self):
        return self.title