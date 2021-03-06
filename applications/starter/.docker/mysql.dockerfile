FROM mysql:8.0

MAINTAINER Walter Leinert

# DB-Dump für Docker und Mysql für automatischen Import kopieren
COPY ./database/starter.sql /docker-entrypoint-initdb.d/000_starter.sql
COPY ./database/patches/001/*.sql /docker-entrypoint-initdb.d/

# Terminal u.a. für bash setzen
ENV TERM=vt100

# Mysql Port freigeben
EXPOSE 3306

ENTRYPOINT ["/entrypoint.sh"]

# manueller Dockerimage-Build (z.B.):
# docker build -f docker-mysql-starter.dockerfile --tag walter/starter-mysql ../

# To run the image (add -d if you want it to run in the background)
# docker run -p 3406:3306 --env-file .docker/mysql.development.env -d --name starter-mysql walter/starter-mysql

CMD ["mysqld"]