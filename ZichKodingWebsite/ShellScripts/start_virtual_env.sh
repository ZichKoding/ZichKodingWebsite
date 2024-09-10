#!/bin/bash

# Activate virtual environment if it's not already active.
# If it's already active, exit the script.
if [ -z "$VIRTUAL_ENV" ]; then
    echo "No virtual environment found. Activating virtual environment..."
else
  echo "Virtual environment is already active."
  exit 0
fi

# Switch to root folder
cd ../
ls

# Activate virtual environment
source ara-aws/Scripts/activate

# Check if virtual environment is activated
if [ -z "$VIRTUAL_ENV" ]; then
    echo "Virtual environment failed to activate."
    exit 1
else
    echo "Virtual environment activated successfully."
    # Change directory to the Django project
    cd ara_aws_app
fi