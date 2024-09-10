#!/bin/bash

# Message the user that this is for Creating a GitHub Repository
echo "@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@"
echo "Creating a GitHub Repository..."

# Get the app name from user input
read -p "Enter the name of your app: " app_name

echo "# $app_name" >> README.md
git init
git add README.md
git commit -m "first commit"
git branch -M main
git remote add origin git@github.com:ZichKoding/$app_name.git
git push -u origin main