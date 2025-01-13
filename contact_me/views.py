from datetime import timedelta
import os

from django.shortcuts import render
from django.views import View
from django.http import JsonResponse
from django.utils import timezone
from django.middleware.csrf import get_token

from .models import Contact, Message

class ContactFormView(View):
    def add_contact_and_message(self, data):
        '''
        Add the contact and message data to the database

        Args:
            data (dict): The data from the contact form

        Returns:
            message (str): A message to display to the user
            
        Raises:
            ValueError: If the contact already exists with the same email address but differet first and last name
            TimeoutError: If the user has sent more than 15 messages in the last hour
        '''
        # Get the data from the request
        first_name = data.get('first_name')
        last_name = data.get('last_name')
        email = data.get('email')
        subject = data.get('subject')
        message = data.get('message')
        project_url = data.get('project_url')
        project_title = data.get('project_title')

        # Check if the contact already exists
        contact = Contact.objects.filter(email=email).first()
        if contact:
            # Check if the first and last name match
            if contact.first_name != first_name or contact.last_name != last_name:
                raise ValueError('A contact with that email already exists with a different first or last name')
        else:
            # Create a new contact
            contact = Contact.objects.create(
                first_name=first_name,
                last_name=last_name,
                email=email
            )
        
        # Check if the user has sent more than 15 messages in the last hour
        messages = Message.objects.filter(contact_id=contact)
        # Get the number of messages sent in the last hour
        messages_sent = messages.filter(submitted_at__gte=timezone.now() - timedelta(hours=1)).count()
        if messages_sent >= 15:
            raise TimeoutError('You have reached the limit of messages sent for the hour. Please try again later.')

        # Create a new message
        message = Message.objects.create(
            subject=subject,
            message=message,
            project_url=project_url,
            project_title=project_title,
            contact_id=contact
        )

        return 'Message sent successfully'
    

    def get(self, request):
        return render(request, 'contact_me/index.html', {'csrf_token': get_token(request)})
    
    def post(self, request):
        '''
        Handle the POST request from the contact form.

        Args:
            request (HttpRequest): The request object

        Returns:
            JsonResponse: A JSON response with a message for the user
        '''
        # Get the HTTP method
        method = request.method
        if method != 'POST':
            return JsonResponse({'message': 'Method not allowed'}, status=405)

        # Verify CSRF token
        csrf_token = request.COOKIES.get('csrftoken')
        # I need to verify the CSRF token
        if not csrf_token:
            return JsonResponse({'message': 'Invalid CSRF token'}, status=403)

        # Get the data from the request
        data = request.POST

        try:
            # Add the contact and message data
            message = self.add_contact_and_message(data)
        except ValueError as e:
            return JsonResponse({'message': str(e)}, status=400)
        except TimeoutError as e:
            return JsonResponse({'message': str(e)}, status=429)
        except Exception as e:
            return JsonResponse({'message': str(e)}, status=500)
        
        return JsonResponse({'message': message}, status=200)
