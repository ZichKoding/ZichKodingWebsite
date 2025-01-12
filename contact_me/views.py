from django.shortcuts import render
from django.views import View


class ContactFormView(View):
    def get(self, request):
        return render(request, 'contact_me/index.html')
    
    def post(self, request):
        return render(request, 'contact_me/index.html')