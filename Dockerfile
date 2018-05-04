FROM gennovative/nodejs:7.10.1-alpine

WORKDIR /usr/src

COPY . .

EXPOSE 1337

RUN yarn install && yarn cache clean

CMD ["node", "app.js", "--prod"]