#!/bin/bash

# Function to turn text green based on parameter
green_text() {
    echo "\033[32m$1\033[0m"
}

# Function to turn text red based on parameter
red_text() {
    echo "\033[31m$1\033[0m"
}

# Function to run tests
run_tests() {
    success_message=$(green_text "Tests passed")
    failure_message=$(red_text "Tests failed. Please fix the errors before pushing to the repository.")
    # Try running tests with 'python'
    if python manage.py test; then
        # Make the text color green if the tests pass
        echo "$success_message with 'python'."
    # If 'python' fails, try 'python3'
    elif python3 manage.py test; then
        echo "$success_message with 'python3'."
    else
        echo "$failure_message"
        exit 1
    fi
}

# Run the tests
run_tests

# Display the branch name and confirm the branch is correct from user input.
branch_name=$(git branch | grep \* | cut -d ' ' -f2)
branch_name=$(green_text $branch_name)
echo "You are on branch: $branch_name"
read -p "Is this the correct branch? ($(green_text "y")/$(red_text "n")): " branch_confirmation

# If the branch is not correct, exit the script.
if [ $branch_confirmation != "y" ]; then
    echo $(red_text "Please checkout the correct branch before running this script.")
    exit 1
fi

# Get the status of the files in the repository
git status

# Add all the files to the repository
git add .

# Get the commit message from the user and needs to be a string of text. It needs to be longer than one word. 
read -p "Enter the commit message: " commit_message

# Confirm the commit message
echo "Commit message: $(green_text "$commit_message")"
read -p "Is this the correct commit message? ($(green_text "y")/$(red_text "n")): " commit_confirmation

# If the commit message is not correct, exit the script.
if [ $commit_confirmation != "y" ]; then
    echo $(red_text "Please enter the correct commit message before running this script.")
    exit 1
fi

# Commit the files to the repository
git commit -m "$commit_message"

# Confirm the status of the files in the repository
git status

# Confirm pushing the files to the repository
read -p "Do you want to push the files to the repository? ($(green_text "y")/$(red_text "n")): " push_confirmation

# If the user does not want to push the files, exit the script.
if [ $push_confirmation != "y" ]; then
    echo $(red_text "Please push the files to the repository when you are ready.")
    exit 1
fi

# Push the files to the repository
git push origin $branch_name
