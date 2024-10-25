# Initialize the variables for commit message and branch name.
commit_message="Added a class for the MissionStatementView and tested. I figure I can add features more easily this way."
branch_name="main"

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