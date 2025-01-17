release: python manage.py makemigrations home contact_me projects
release: python manage.py migrate

web: gunicorn your_project_name.wsgi:application --bind 0.0.0.0:$PORT
