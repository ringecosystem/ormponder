FROM node:21-alpine

COPY . /app

RUN cd /app && \
    yarn install && \
    yarn codegen

WORKDIR /app

ENTRYPOINT ["/app/scripts/entrypoint.sh"]
