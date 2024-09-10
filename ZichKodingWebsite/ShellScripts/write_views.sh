#!/bin/bash

# Message the user that this is for writing views.py in the app
echo "@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@"
echo "Writing views.py in the app..."

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

# Check if the app's views.py file exists
if [ -f "views.py" ]; then
    # Print a success message to confirm that the views file exists
    echo "views.py file found in the app directory."
else
    # Print an error message and exit if the views file is not found
    echo "views.py file not found in the app directory."
    exit 1
fi

# Update views.py with Hello World
cat << EOF > views.py
from django.http import HttpResponse

def hello_world(request):
    return HttpResponse("Hello, World!")

EOF


# Print a success message to confirm that views have been updated successfully
echo "views.py has been updated with the Hello World function."

cd ../

# Make migrations and migrate the database
python manage.py makemigrations
python manage.py migrate

# Run the unit tests using the Django test runner
python manage.py test $app_name
# Write Output of tests.py to an HTML file
python manage.py test $app_name 2> test_results.txt