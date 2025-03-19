# Use a Node.js base image with Yarn pre-installed
FROM node:20-alpine3.21 AS base

ENV APP_HOME=/code
# Update and install common OS packages
RUN apk update --no-cache && apk upgrade --no-cache --ignore alpine-baselayout

RUN mkdir /code
WORKDIR /code
COPY . /code


FROM base AS frontend-builder
RUN apk update --no-cache && apk upgrade --no-cache
RUN apk add --no-cache --virtual jpeg-dev zlib-dev git bash

RUN node -v

RUN npm install -g @craco/craco

# Making script files executable
RUN chmod +x /code/scripts/fonts.sh
RUN chmod +x /code/scripts/build.sh

# install
RUN yarn install

FROM frontend-builder AS final

RUN ./scripts/build.sh
RUN ./scripts/fonts.sh

RUN yarn install
RUN yarn build

CMD ["yarn", "start"]
