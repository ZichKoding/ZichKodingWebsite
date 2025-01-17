release: python manage.py makemigrations home contact_me projects && python manage.py migrate

web: gunicorn ZichKodingWebsite.wsgi:application --bind 0.0.0.0:$PORT
