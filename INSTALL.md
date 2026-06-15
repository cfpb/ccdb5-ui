# Installation instructions

## Installing

```bash
# Clone the project from github
git clone https://github.com/cfpb/ccdb5-ui.git
cd ccdb5-ui
corepack enable
yarn install
```

Yarn is managed via Corepack, using the version pinned in `package.json`.

## Verifying the build

```bash
yarn build
yarn start
```

Open http://localhost:3000 to view it in the browser.
