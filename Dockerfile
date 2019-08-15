FROM node:latest
MAINTAINER rupar

# Change workdir
WORKDIR /app

ADD app.js app.js
ADD package.json package.json

RUN npm install
RUN npm update
RUN npm install express --save
RUN npm install mongoose --save

# Start application
CMD node app.js