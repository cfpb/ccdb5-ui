# Installation instructions

## Installing

```bash
# Clone the project from github
git clone https://github.com/cfpb/ccdb5-ui.git
cd ccdb5-ui

# Setup python development
mkvirtualenv ccdb5-ui
pip install -r requirements.txt

# Setup node/react/webpack development
npm install  # yarn install also works
npm run build
```

## Configuring
_TODO: Define how the API URL is injected into the codebase_

## Verifying the build

```bash
python manage.py runserver
```

Open http://localhost:8000 to view it in the browser.