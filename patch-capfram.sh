#!/bin/sh

cd node_modules/capital-framework/src/cf-core/src
sed -i '' -e 's|../../|~|g' cf-core.less

cd ../../cf-grid/src
sed -i '' -e 's|../../|~|g' cf-grid.less
