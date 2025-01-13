from django.urls import path
from .views import ContactFormView

urlpatterns = [
    path('contact-form', ContactFormView.as_view(), name='contact'),
    path('api/message', ContactFormView.as_view(), name='contact/api/message')
]