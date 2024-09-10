#!/bin/bash

# Message the user that this is for writing tests.py in the app
echo "@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@"
echo "Writing tests.py in the app..."

# Get the list of directories in the current directory
directories=$(find . -maxdepth 1 -type d -not -path '*/\.*' -printf '%f\n')

# Prompt the user to choose from the list of directories
PS3="Enter the number corresponding to the APP directory: "
select app_name in $directories; do
    if [ -n "$app_name" ]; then
        break
    else
        echo "Invalid selection. Please try again."
    fi
done

# Check if the app directory exists
if [ -d "$app_name" ]; then
    # Change to the app directory
    cd "$app_name"
    echo "Moved to $app_name directory."
else
    echo "App directory not found."
fi

# Check if the app directory contains a tests.py file
if [ -f "tests.py" ]; then
    # Run the unit tests using the Django test runner
    python manage.py test
else
    echo "No tests.py file found in the app directory."
fi

# Add test cases to the tests.py file
cat << EOF > tests.py
from django.test import TestCase

# import hello_world function from views
from .views import hello_world

class HelloWorldTestCase(TestCase):
    def test_hello_world(self):
        response = hello_world(None)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.content, b'Hello, World!')
EOF

# Change back to the project directory
cd ../

# Show PWD
pwd
