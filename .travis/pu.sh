#!/bin/sh

setup_git() {
  git config --global user.email "cfpbdeploybot@users.noreply.github.com"
  git config --global user.name "cfpbdeploybot"
  git config --global push.default matching
  git config credential.helper "store --file=.git/credentials"
  echo "https://${GITHUB_API_KEY}:@github.com" > .git/credentials
}

make_version() {
  if [ -n $(git status -s) ]
  then
    echo Uncommited changes! Try to reverse dirty state
    git checkout -- .
    git status
  fi
  npm version patch -m "chore: release version %s [skip ci]"
}

upload_files() {
  git push origin HEAD:$TRAVIS_BRANCH
  git push --tags
}

setup_git
make_version
upload_files