# from django.test import TestCase, Client
# from django.urls import reverse
# from django.contrib.auth.models import User

# from home.models import Project


# class ProjectsAdminTest(TestCase):
#     def setUp(self):
#         # Create a superuser
#         self.admin_user = User.objects.create_superuser(
#             username='admin',
#             email='admin@example.com',
#             password='adminpass'
#         )

#         # Log the superuser in
#         self.client = Client()
#         self.client.login(username='admin', password='adminpass')

#         # Create test data
#         # self.project = Project.objects.create(
#         #     title='Test project',
#         #     description='Test description',
#         #     project_url='https://www.example.com',
#         #     is_active=True
#         # )