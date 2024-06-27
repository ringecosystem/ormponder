FROM node:21-alpine

COPY . /app

RUN cd /app \
    && yarn install \
    && npx zx /app/scripts/init.mjs --chain=darwinia \
    && yarn codegen

WORKDIR /app

ENTRYPOINT ["/app/scripts/entrypoint.sh"]
