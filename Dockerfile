FROM rhel8/nodejs20:latest

USER root

ENV GV_SW_DIR=/opt/sw
ENV NODEJS_HOME=${GV_SW_DIR}/nodejs

WORKDIR ${NODEJS_HOME}

COPY dist app

RUN chown -R wasadmin:was app

USER wasadmin
