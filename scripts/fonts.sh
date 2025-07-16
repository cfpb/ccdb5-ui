#!/usr/bin/env bash

# https://github.com/cfpb/design-system/pull/2309/files#diff-90f15467c133b5bbfee15918b85af670f342d74323094f8caad8fbb2b2628878
FONT_VARIABLE="source-sans-3-latin-wght-normal.woff2"
BASE_DIR="./src/static/fonts"

# Add required webfonts locally to src/static/fonts/ directory.
echo "creating $BASE_DIR"
mkdir -p $BASE_DIR
echo "Copying ./node_modules/@fontsource-variable/source-sans-3/files/$FONT_VARIABLE to $BASE_DIR/$FONT_VARIABLE"
cp ./node_modules/@fontsource-variable/source-sans-3/files/$FONT_VARIABLE $BASE_DIR/$FONT_VARIABLE

