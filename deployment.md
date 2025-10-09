# Deployment Guide - Kabloom Frontend

## Steps for front-end code production deployment

- Goto code repo in the server, and pull latest code

```bash
 # (as ubuntu user not root)
 cd /home/ubuntu/uicodebase/kabloom-frontend/

 # Backup current deployed build
 cp -r build ../build-`date +%F`

 # Make sure the repo is in clean state
 git status

 # Stash the uncommitted changes from package-lock.json(optional only if uncommitted changes are there)
 git checkout -- packag-lock.json

 # Pull latest code
 git pull

# Run the build
./appBuild

# Restart nginx
sudo systemctl restart nginx
```

