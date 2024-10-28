#!/bin/bash

# Initialize the variables for commit message and branch name.
commit_message="Getting setup for creating the landing page view."
branch_name="main"

# Function to run tests
run_tests() {
    # Try running tests with 'python'
    if python manage.py test; then
        echo "Tests passed with 'python'."
    # If 'python' fails, try 'python3'
    elif python3 manage.py test; then
        echo "Tests passed with 'python3'."
    else
        echo "Tests failed. Please fix the errors before pushing to the repository."
        exit 1
    fi
}

# Run the tests
run_tests

# Get the status of the files in the repository
git status

# Add all the files to the repository
git add .

# Commit the files to the repository
git commit -m "$commit_message"

# Confirm the status of the files in the repository
git status

# Push the files to the repository
git push origin $branch_name
