FROM heroku/heroku:20

ENV NODE_ENV production
ENV PORT 3000

WORKDIR /usr/src/app

COPY ./.config/ ./.config/
COPY ./content/ ./content/
COPY --chmod=755 ./src/bin/*.sh ./src/bin/
COPY ./src/data/ ./src/data/
COPY ./src/docker/ ./src/docker/
COPY ./src/server/ ./src/server/
COPY ./src/static/ ./src/static/
COPY ./src/tools/ ./src/tools/
COPY ./static/ ./static/
COPY ./themes/ ./themes/
COPY ./package.json ./package.json

RUN ./src/bin/setup.sh
RUN yarn install
RUN ./src/bin/postbuild.sh

EXPOSE 3000

CMD node dist/server/server.js
