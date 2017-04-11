FROM 		node:latest

MAINTAINER Walter Leinert

WORKDIR /var/www/libraries

COPY ./.docker/config/pm2.json /pm2.json

ENV TERM=vt100

RUN npm install -g pm2@latest

RUN mkdir -p /var/log/pm2

EXPOSE 		8080

#ENTRYPOINT ["pm2", "start", "pm2.json", "--env", "development"]

# TODO: startet nicht
# ENTRYPOINT ["pm2", "start", "/pm2-starter.json", "--env", "development"]

ENTRYPOINT ["pm2", "start", "server.js", "--name", "libraries", "--log", "/var/log/pm2/pm2.log", "--watch", "--no-daemon"]
