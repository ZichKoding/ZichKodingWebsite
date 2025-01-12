#!/bin/bash

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

# Display the branch name and confirm the branch is correct from user input.
branch_name=$(git branch | grep \* | cut -d ' ' -f2)
echo "You are on branch: $branch_name"
read -p "Is this the correct branch? (y/n): " branch_confirmation

# If the branch is not correct, exit the script.
if [ $branch_confirmation != "y" ]; then
    echo "Please checkout the correct branch before running this script."
    exit 1
fi

# Get the status of the files in the repository
git status

# Add all the files to the repository
git add .

# Get the commit message from the user
read -p "Enter the commit message: " commit_message

# Confirm the commit message
echo "Commit message: $commit_message"
read -p "Is this the correct commit message? (y/n): " commit_confirmation

# If the commit message is not correct, exit the script.
if [ $commit_confirmation != "y" ]; then
    echo "Please enter the correct commit message before running this script."
    exit 1
fi

# Commit the files to the repository
git commit -m "$commit_message"

# Confirm the status of the files in the repository
git status

# Confirm pushing the files to the repository
read -p "Do you want to push the files to the repository? (y/n): " push_confirmation

# If the user does not want to push the files, exit the script.
if [ $push_confirmation != "y" ]; then
    echo "Please push the files to the repository when you are ready."
    exit 1
fi

# Push the files to the repository
git push origin $branch_name
