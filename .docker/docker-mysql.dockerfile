FROM mysql:latest

MAINTAINER Walter Leinert

# DB-Dump für Docker und Mysql für automatischen Import kopieren
COPY ./database/libraries.sql /docker-entrypoint-initdb.d/000_libraries.sql
# COPY ./database/patches/*/*.sql /docker-entrypoint-initdb.d/


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