#!/usr/bin/env bash

pwd
pwd
pwd

# This command overrides the original create react app command.
echo "Running craco build for $NODE_ENV"
craco build --no-verify

# Move CSS assets.
mv ./build/static/css/main.*.css ./dist/ccdb5.css
mv ./build/static/css/main.*.css.map ./dist/ccdb5.css.map

# Rewrite the font file path.
echo "Replacing paths /static/media/ with /static/fonts/"
search="static\/media"
replace="static\/fonts"
sed -i "" -e "s/$search/$replace/g" -e "s/\.[a-zA-Z0-9]*\.woff/.woff/g" dist/ccdb5.css

# Move JS assets.
mv ./build/static/js/main.*.js ./dist/ccdb5.js
mv ./build/static/js/main.*.js.map ./dist/ccdb5.js.map
