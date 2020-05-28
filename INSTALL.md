# Installation instructions

## Installing

```bash
# Clone the project from github
git clone https://github.com/cfpb/ccdb5-ui.git
cd ccdb5-ui

# Setup python development and run the frontend build
mkvirtualenv ccdb5-ui
pip install -e .
```

## Configuring
_TODO: Define how the API URL is injected into the codebase because they are hardcoded in the config files_

## Verifying the build

```bash
python manage.py runserver
```

Open http://localhost:8000 to view it in the browser.
