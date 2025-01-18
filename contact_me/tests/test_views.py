'''
Testing the views of the contact_me app. 
Test Cases:
    - Test that the contact form view is rendered correctly
    - Test that the contact form view is rendered correctly when a POST request is made
    - Test that the contact form view sends the data to the correct data tables and associates the Contact and Message data. 
    - Test that the contact form only allows for 15 messages sent per hour per user based on email address.
    - Test that only the form on the /contact/contact-form/ page is able to send messages.
    - Test that an invalid CSRF token prevents form submission.
'''

import json
from django.test import TestCase
from django.urls import reverse
from django.middleware.csrf import CsrfViewMiddleware
from contact_me.models import Message

class TestContactFormView(TestCase):
    def test_contact_form_view_get(self):
        '''
        Test that the contact form view is rendered correctly
        '''
        response = self.client.get(reverse('contact'))
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'contact_me/index.html')

    def test_contact_form_view_post(self):
        '''
        Test that the contact form view is rendered correctly when a POST request is made
        '''
        # Perform initial GET request to set CSRF token
        response = self.client.get(reverse('contact'))
        csrf_token = response.cookies['csrftoken'].value

        response = self.client.post(reverse('contact/api/message'), {
            'subject': 'Test Subject',
            'first_name': 'Chris',
            'last_name': 'Zichko',
            'email': 'test1@email.com',
            'message': 'This is a test message',
            'project_url': 'http://www.test.com/test-project',
            'project_title': 'Test Project'
        }, HTTP_X_CSRFTOKEN=csrf_token)

        self.assertEqual(response.status_code, 200)

        # Test that the message was created
        message = Message.objects.get(message="This is a test message")
        self.assertEqual(message.message, "This is a test message")
        self.assertEqual(message.project_url, "http://www.test.com/test-project")
        self.assertEqual(message.project_title, "Test Project")
        self.assertEqual(message.contact_id.email, "test1@email.com")
        self.assertEqual(message.contact_id.first_name, "Chris")
        self.assertEqual(message.contact_id.last_name, "Zichko")

    def test_contact_form_view_post_limit(self):
        '''
        Test that the contact form only allows for 15 messages sent per hour per user based on email address.
        '''
        # Perform initial GET request to set CSRF token
        response = self.client.get(reverse('contact'))
        csrf_token = response.cookies['csrftoken'].value

        for i in range(15):
            response = self.client.post(reverse('contact/api/message'), {
                'subject': f'Test Subject {i}',
                'first_name': 'Chris',
                'last_name': 'Zichko',
                'email': f'test@email.com',
                'message': 'This is a test message',
                'project_url': f'http://www.test.com/test-project-{i}',
                'project_title': f'Test Project {i}'
            }, HTTP_X_CSRFTOKEN=csrf_token)
            self.assertEqual(response.status_code, 200)

        # Test that the 16th message is not created
        response = self.client.post(reverse('contact/api/message'), {
            'subject': 'Test Subject 16',
            'first_name': 'Chris',
            'last_name': 'Zichko',
            'email': 'test@email.com',
            'message': 'This is a test message',
            'project_url': 'http://www.test.com/test-project-16',
            'project_title': 'Test Project 16'
        }, HTTP_X_CSRFTOKEN=csrf_token)

        # Get the message from the response in JSON format
        message = json.loads(response.content).get('message')

        self.assertEqual(response.status_code, 429)
        self.assertEqual(Message.objects.count(), 15)
        self.assertEqual(message, "You have reached the limit of messages sent for the hour. Please try again later.")

    def test_contact_form_invalid_csrf(self):
        '''
        Test that an invalid CSRF token prevents form submission.
        '''
        invalid_csrf_token = "invalidtoken"
        response = self.client.post(reverse('contact/api/message'), {
            'subject': 'Test Subject',
            'first_name': 'Chris',
            'last_name': 'Zichko',
            'email': 'test2@email.com',
            'message': 'This is a test message with invalid CSRF',
            'project_url': 'http://www.test.com/invalid-csrf',
            'project_title': 'Invalid CSRF Test'
        }, HTTP_X_CSRFTOKEN=invalid_csrf_token)

        self.assertEqual(response.status_code, 403)
        message = json.loads(response.content).get('message')
        self.assertEqual(message, 'Invalid CSRF token')

    def test_missing_csrf_token(self):
        '''
        Test that a missing CSRF token results in a 403 Forbidden response.
        '''
        response = self.client.post(reverse('contact/api/message'), {
            'subject': 'Test Subject',
            'first_name': 'Chris',
            'last_name': 'Zichko',
            'email': 'test3@email.com',
            'message': 'This is a test message with missing CSRF',
            'project_url': 'http://www.test.com/missing-csrf',
            'project_title': 'Missing CSRF Test'
        })

        self.assertEqual(response.status_code, 403)
        message = json.loads(response.content).get('message')
        self.assertEqual(message, 'Invalid CSRF token')
