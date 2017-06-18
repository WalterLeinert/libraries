FROM 		node:latest

MAINTAINER Walter Leinert

COPY ./.docker/development-entrypoint.sh /entrypoint.sh

WORKDIR /home/node

# COPY ./.docker/config/pm2.json /pm2.json

ENV TERM=vt100

RUN apt-get update && \
    apt-get install -y vim

USER node

COPY ./.docker/index.js /home/node

RUN mkdir -p /home/node/npm && \
    npm config set prefix /home/node/npm && \
    npm install -g gulp && \
    npm install -g verdaccio
# RUN npm install -g @angular/cli@1.0.0

ENV HOME=/home/node
ENV NODE_HOME $HOME/node
ENV PATH $PATH:$HOME/npm/bin


# EXPOSE 		8080

#ENTRYPOINT ["pm2", "start", "pm2.json", "--env", "development"]

# TODO: startet nicht
# ENTRYPOINT ["pm2", "start", "/pm2-starter.json", "--env", "development"]

# ENTRYPOINT ["pm2", "start", "server.js", "--name", "libraries", "--log", "/var/log/pm2/pm2.log", "--watch", "--no-daemon"]

# ENTRYPOINT [ "/entrypoint.sh" ]

CMD [ "node", "index.js" ]