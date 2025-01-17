# Use the official Python image as the base image
FROM python:3.9-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Set the working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && \
    apt-get install -y build-essential libpq-dev && \
    rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt /app/
RUN pip install --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Copy the project files
COPY . /app/

# Set STATIC_ROOT environment variable (required for collectstatic)
ENV STATIC_ROOT=/app/static

# Migrate the database
RUN python manage.py makemigrations
RUN python manage.py makemigrations home projects contact_me
RUN python manage.py migrate

# Collect static files
RUN python manage.py collectstatic --noinput

# Expose the port that the app runs on
EXPOSE 8000

# Define the command to run the application
CMD ["gunicorn", "ZichKodingWebsite.wsgi:application", "--bind", "0.0.0.0:8000"]
