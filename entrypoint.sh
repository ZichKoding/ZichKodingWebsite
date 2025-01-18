#!/bin/bash

# Run database migrations
echo "Applying database migrations..."
python manage.py makemigrations
python manage.py migrate

# Collect static files
echo "Collecting static files..."
python manage.py collectstatic --noinput

# Execute the CMD defined in the Dockerfile
echo "Starting the application..."
exec "$@"

