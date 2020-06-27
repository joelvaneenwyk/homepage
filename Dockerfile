FROM node:14.4-stretch

ENV NODE_ENV production
ENV PORT 3000

WORKDIR /usr/src/app
COPY "*" ./
COPY "source/" ./
COPY "assets/" ./

# https://stackoverflow.com/questions/18136746/npm-install-failed-with-cannot-run-in-wd
RUN npm install --production --unsafe-perm --force

RUN mv node_modules ../
RUN mv bower_components ../
COPY . .

EXPOSE 3000

CMD npm start
