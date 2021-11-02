# not using alpine as we need bash for docker-compose
FROM node:14.18

# Dockerize is needed to sync containers startup
ENV DOCKERIZE_VERSION v0.6.0
RUN wget https://github.com/jwilder/dockerize/releases/download/$DOCKERIZE_VERSION/dockerize-alpine-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
    && tar -C /usr/local/bin -xzvf dockerize-alpine-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
    && rm dockerize-alpine-linux-amd64-$DOCKERIZE_VERSION.tar.gz

# Install sequelize-cli
RUN npm install -g sequelize-cli

COPY package.json /api/package.json

WORKDIR /api

RUN yarn

COPY . /api

EXPOSE 8080

# overriden by docker-compose
CMD npm start 
