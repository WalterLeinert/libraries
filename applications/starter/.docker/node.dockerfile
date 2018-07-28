FROM 		node:latest

MAINTAINER Walter Leinert

WORKDIR /var/www/starter

COPY ./.docker/config/pm2.json /pm2.json

ENV TERM=vt100

RUN npm install -g pm2@latest

RUN mkdir -p /var/log/pm2

EXPOSE 		8080

ENTRYPOINT [ "pm2", "start", "server.js", "--name", "starter", "--log", "/var/log/pm2/pm2.log", "--watch", "--no-daemon" ]