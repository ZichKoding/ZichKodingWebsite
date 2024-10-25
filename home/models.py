from django.db import models


class MissionStatement(models.Model):
    mission_statement = models.TextField(max_length=250)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.mission_statement