release: python manage.py migrate
web: gunicorn ZichKodingWebsite.wsgi:application --bind 0.0.0.0:$PORT
