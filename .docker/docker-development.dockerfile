FROM 		node:6

MAINTAINER Walter Leinert



WORKDIR /home/node

# COPY ./.docker/config/pm2.json /pm2.json

ENV TERM=vt100



RUN apt-get update && \
    apt-get install -y vim



COPY ./.docker/development-entrypoint.sh /home/node/entrypoint.sh
COPY ./.docker/index.js /home/node
COPY ./.docker/npm-login.sh /home/node
COPY ./.docker/development-profile.sh /home/node/.profile
COPY ./.docker/setup-development.sh /home/node/setup-development.sh

RUN chown -R node.node /home/node/* && \
    chown -R node.node /home/node/.*

USER node

# RUN chown node.node .profile && \
#     chown node.node entrypoint.sh && \
#     chown node.node npm-login.sh

ENV HOME=/home/node
ENV PATH $PATH:$HOME/npm/bin
ENV NPM_CONFIG_LOGLEVEL=error

RUN mkdir -p /home/node/npm && \
    mkdir -p /home/node/log && \
    chown -R node.node /home/node/* && \
    chown -R node.node /home/node/.* && \
    npm config set prefix /home/node/npm && \
    npm install -g pm2@latest && \
    npm install -g gulp-cli && \
    npm install -g verdaccio && \
    npm install -g @angular/cli && \
    npm set registry http://localhost:4873 && \
    sh -x /home/node/npm-login.sh

# RUN npm install -g @angular/cli@1.0.0




# EXPOSE 		8080

#ENTRYPOINT ["pm2", "start", "pm2.json", "--env", "development"]

# TODO: startet nicht
# ENTRYPOINT ["pm2", "start", "/pm2-starter.json", "--env", "development"]

# ENTRYPOINT ["pm2", "start", "index.js", "--name", "dummy", "--log", "/home/node/log/pm2/dummy.log"]

# ENTRYPOINT [ "/home/node/entrypoint.sh" ]

# CMD [ "verdaccio", ">", "/home/node/log/verdaccio.log 2>&1 &" ]
CMD [ "node", "index.js" ]