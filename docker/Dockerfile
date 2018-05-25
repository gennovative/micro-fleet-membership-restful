#FROM gennovative/nodejs:7.10.1-alpine
FROM node:8-alpine

WORKDIR /usr/src

RUN mkdir /root/.ssh
COPY docker/.ssh /root/.ssh

COPY . .

# Install neccessary packages for rebuilding NPM modules, then uninstall them to keep the image tiny.
RUN apk add --update --virtual .dev-dep git openssh build-base ca-certificates python perl openssh-client gnupg netcat-openbsd && \
    rm -rf /var/lib/apk/lists/* && \
    rm /var/cache/apk/* && \
	yarn install --production --ignore-engines && yarn cache clean && \
	apk del .dev-dep && \
    rm -rf /root/.ssh

CMD ["node", "./dist/app/server.js"]
