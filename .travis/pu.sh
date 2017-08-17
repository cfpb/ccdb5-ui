#!/bin/sh

setup_git() {
  git config --global user.email "cfpbdeploybot@users.noreply.github.com"
  git config --global user.name "cfpbdeploybot"
  git config --global push.default matching
  git config credential.helper "store --file=.git/credentials"
  echo "https://${GITHUB_API_KEY}:@github.com" > .git/credentials
}

make_version() {
  npm version patch -m "[skip ci] Releasing, upgrading the version to %s"
  # git tag <tag-name> -a -f -m "Travis build: $TRAVIS_BUILD_NUMBER"
}

upload_files() {
  git push origin HEAD:$TRAVIS_BRANCH
  git push --tags
}

setup_git
make_version
upload_files