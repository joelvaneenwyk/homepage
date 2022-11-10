FROM heroku/heroku:20

ENV NODE_ENV production
ENV PORT 3000

WORKDIR /usr/src/app

COPY . .

RUN ./src/bin/setup.sh
RUN yarn install
RUN ./src/bin/postbuild.sh

EXPOSE 3000

CMD node dist/server/server.js
