#!/bin/bash

# Message the user that this is for updating the GitHub Repository
echo "@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@"
echo "Updating the GitHub Repository..."

cd ../
pwd

# Check if the current directory is a Git repository
if [ -d ".git" ]; then
    echo "This is a Git repository."
else
    echo "This is not a Git repository. Please run the script in a Git repository."
    exit 1
fi

# Get the current Git branch
branch=$(git rev-parse --abbrev-ref HEAD)

# Use the branch variable for further operations
echo "Current branch: $branch"

# Ask the user if this is the correct branch with a yes or no prompt selection like a drop down menu
echo "Is this the correct branch?"
select yn in "Yes" "No"; do
    case $yn in
        Yes ) echo "Great!"; break;;
        No ) echo "Please checkout the correct branch and run the script again."; exit;;
    esac
done

# Check if the branch is up to date with the remote branch
git fetch
git status

# Ask the user if they want to continue with pushing to the remote branch
echo "Do you want to continue with pushing to the remote branch?"
select yn in "Yes" "No"; do
    case $yn in
        Yes ) echo "Great!"; break;;
        No ) echo "Please pull the latest changes and run the script again."; exit;;
    esac
done

# Commit the changes with a message from user input in a variable called commit_message
echo "Enter commit message:"
read commit_message
git add .
git commit -m "$commit_message"

# Push the changes to the remote branch
git push origin $branch

# Check if the push was successful
if [ $? -eq 0 ]; then
    echo "Push successful."
else
    echo "Push failed."
fi