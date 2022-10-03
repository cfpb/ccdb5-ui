# Installation instructions

## Installing

```bash
# Clone the project from github
git clone https://github.com/cfpb/ccdb5-ui.git
cd ccdb5-ui
yarn install
```

This installs the dependencies. If you run `yarn build` at this point,
you should received an error `Module not found: Error: Can't resolve …` in
regard to the font files. Follow the next step to install the font files.

### Install font files

To install self-hosted fonts locally, place the font files
in `./src/static/fonts/`. This can be done with the script `./scripts/fonts.sh`.

## Verifying the build

```bash
yarn build
yarn start
```

Open http://localhost:3000 to view it in the browser.
