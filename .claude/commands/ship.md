Commit all uncommitted changes and push to origin main.

1. Run `git status` to see what's changed
2. Run `git diff` to review the changes
3. Stage all modified/new files relevant to the changes (avoid secrets or unrelated files)
4. Ask the user for a commit message if they haven't provided one with the command (e.g. `/ship fix search styling`)
5. Commit with the provided or agreed message, including the standard Co-Authored-By trailer
6. Push to origin main
7. Confirm the push succeeded
