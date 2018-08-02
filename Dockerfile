From node:latest

COPY ./package* /home/node/
COPY ./redis.js /home/node/
COPY ./thousand.txt /home/node/
COPY ./ten-thousand.txt /home/node/

ENV HOST 192.168.1.22
ENV LEN 32

WORKDIR /home/node/
RUN npm install express
RUN npm install redis
RUN npm install log4js
RUN npm install fs
RUN npm install redis-connection-pool
CMD  node redis.js
