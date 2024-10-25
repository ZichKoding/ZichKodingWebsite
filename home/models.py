from django.db import models


class MissionStatement(models.Model):
    mission_statement = models.TextField(max_length=250)

    def __str__(self):
        return self.mission_statement