#!/bin/bash

# Message the user that this is for writing urls.py in the app and project
echo "@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@"
echo "Writing urls.py in the app and project..."

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

# Check if the app directory contains a urls.py file
if [ -f "urls.py" ]; then
    # Print a success message to confirm that the urls file exists
    echo "urls.py file found in the `$app_name` directory."
else
    # Print an error message and exit if the urls file is not found
    echo "urls.py file not found in the `$app_name` directory."
    # Create a new urls.py file
    touch urls.py
    echo "urls.py file created in the `$app_name` directory."
fi

echo "Updating urls.py file for $app_name..."
# Update urls.py to include the new app's URLs
cat << EOF > urls.py
from django.urls import path
from . import views

app_name = '$app_name'
urlpatterns = [
    path('', views.hello_world, name='hello_world'),
]
EOF

# Change to project directory
cd ../

# Prompt the user to choose from the list of directories
PS3="Enter the number corresponding to the PROJECT directory: "
select project_name in $directories; do
    if [ -n "$project_name" ]; then
        break
    else
        echo "Invalid selection. Please try again."
    fi
done

# Check if the app directory exists
if [ -d "$project_name" ]; then
    # Change to the app directory
    cd "$project_name"
    echo "Moved to $project_name directory."
    pwd
else
    echo "App directory not found."
fi

# Check if the project directory contains a urls.py file
if [ -f "urls.py" ]; then
    # Print a success message to confirm that the urls file exists
    echo "urls.py file found in the `$project_name` directory."
else
    # Print an error message and exit if the urls file is not found
    echo "urls.py file not found in the `$project_name` directory."
    exit 1
fi

echo "Updating urls.py file for $project_name..."
# Set urlpatterns for the new app
urlpatterns="    path('$app_name/', include('$app_name.urls')),"

# Escape forward slashes in urlpatterns
escaped_urlpatterns=$(echo "$urlpatterns" | sed 's/\//\\\//g')

# Update the project's urls.py to include the new app's URLs
sed -i "s/urlpatterns = \[/urlpatterns = \[\n$escaped_urlpatterns/" urls.py

# Update the imports in the project's urls.py
# Confirm the import statement is not already present
if ! grep -q "from django.urls import path, include" urls.py; then
    # Add the import statement to the end of `from django.urls import path`
    sed -i "s/from django.urls import path/from django.urls import path, include/" urls.py
fi

# Change to project directory
cd ../
