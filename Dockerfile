From node:latest

COPY ./package* /home/node/
COPY ./redis.js /home/node/
ENV NUM 10
ENV HOST 192.168.1.172

WORKDIR /home/node/
RUN npm install express
RUN npm install redis
RUN npm install log4js
CMD  node redis.js 
