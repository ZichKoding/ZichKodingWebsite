# Initialize the variables for commit message and branch name.
commit_message="Fixed settings.py to use environment variables from .env file if in development environment."
branch_name="main"

# Get the status of the files in the repository
git status

# Add all the files to the repository
git add .

# Commit the files to the repository
git commit -m "$commit_message"

# Push the files to the repository
git push origin $branch_name