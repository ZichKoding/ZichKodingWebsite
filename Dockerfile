# Use the official Python image as the base image
FROM python:3.10-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Set the working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && \
    apt-get install -y --no-install-recommends build-essential libpq-dev postgresql-client && \
    rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt /app/
RUN pip install --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Copy the project files
COPY . /app/

# Collect static files at runtime (optional but recommended for production)
ENV STATIC_ROOT=/app/static
RUN mkdir -p $STATIC_ROOT

# Copy the entrypoint script
COPY entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh

# Expose the port that the app runs on
EXPOSE 8000

# Use the entrypoint script to run commands
ENTRYPOINT ["/app/entrypoint.sh"]

# Default command to start Gunicorn
CMD ["gunicorn", "ZichKodingWebsite.wsgi:application", "--bind", "0.0.0.0:8000"]
