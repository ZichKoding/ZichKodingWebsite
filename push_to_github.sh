# Initialize the variables for commit message and branch name.
commit_message="Have not fixed the admin view for the image, but I did fix the failing test for published date because I did not add it as a readonly field."
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