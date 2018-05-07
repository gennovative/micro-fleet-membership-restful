#FROM gennovative/nodejs:7.10.1-alpine
FROM node:8.11.1-alpine

WORKDIR /usr/src

RUN mkdir /root/.ssh
COPY docker/.ssh /root/.ssh

COPY . .

# Install neccessary packages for rebuilding NPM modules, then uninstall them to keep the image tiny.
RUN apk --update add git openssh build-base ca-certificates python perl openssh-client gnupg netcat-openbsd && \
    rm -rf /var/lib/apt/lists/* && \
    rm /var/cache/apk/* && \
	npm install --only=production && npm cache clean --force && \
	apk del git openssh build-base ca-certificates python perl openssh-client gnupg netcat-openbsd && \
    rm -rf /root/.ssh

CMD ["node", "./dist/app/server.js"]
