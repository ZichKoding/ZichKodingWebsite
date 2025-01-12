from django.db import models


class Contact(models.Model):
    first_name = models.CharField(blank=True, max_length=50)
    last_name = models.CharField(blank=True, max_length=50)
    email = models.EmailField(unique=True, max_length=255)

    def __str__(self):
        return f"{self.first_name} {self.last_name} - {self.email}"
    

class Message(models.Model):
    acknowledged = models.BooleanField(default=False)
    subject = models.CharField(max_length=100, blank=True)
    message = models.TextField(max_length=1000)
    project_url = models.URLField()
    project_title = models.CharField(blank=True, max_length=100)
    contact_id = models.ForeignKey(Contact, on_delete=models.CASCADE, related_name='messages', null=False, blank=False)
    submitted_at = models.DateTimeField(auto_now_add=True, editable=True)

    def __str__(self):
        return f"{self.contact_id} - {self.project_title}"