From node:latest

COPY ./package* /home/node/
COPY ./redis.js /home/node/
COPY ./thousand.txt /home/node/
COPY ./ten-thousand.txt /home/node/
ENV NUM 10
ENV HOST 192.168.1.226
ENV LEN 32

WORKDIR /home/node/
RUN npm install express
RUN npm install redis
RUN npm install log4js
RUN npm install fs
CMD  node redis.js 
