from django.test import TestCase

# import hello_world function from views
from .views import hello_world

class HelloWorldTestCase(TestCase):
    def test_hello_world(self):
        response = hello_world(None)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.content, b'Hello, World!')
