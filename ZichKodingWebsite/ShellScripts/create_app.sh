#!/bin/bash

echo "@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@"
echo "Creating a new Django app..."

# Get Project Name by reading the project name from the end of pwd
project_name=$(pwd | awk -F/ '{print $NF}')
echo $project_name

# Check if there is a virtual environment
if [ -z "$VIRTUAL_ENV" ]; then
    echo "No virtual environment detected..."
    cd ../
    # Activate the virtual environment
    if [ -d "venv" ]; then
        source venv/Scripts/activate
    else
        python -m venv venv
        if [ -d "venv/Scripts" ]; then
            source venv/Scripts/activate
        else
            source venv/bin/activate
        fi
    fi
    cd $project_name
fi

# Check if the virtual environment has been activated
if [ -z "$VIRTUAL_ENV" ]; then
    echo "Virtual environment not activated. Exiting..."
    exit 1
fi

# Retrieve app name from the user
read -p "Enter the name of the Django app: " app_name

# Create a new Django app
python manage.py startapp $app_name

echo "Updating the project settings.py..."

# Add the new app to the INSTALLED_APPS list in settings.py
sed -i "s/'django.contrib.staticfiles',/'django.contrib.staticfiles',\n    '$app_name',/" $project_name/settings.py

# Create a new urls.py file for the app and update the project's urls.py file
sh write_urls.sh

# Create a new tests.py file for the app and run the unit tests
sh write_unit_tests.sh

# Create a new views.py file for the app
sh write_views.sh

# Make migrations and migrate the database
python manage.py makemigrations
python manage.py migrate

python manage.py runserver