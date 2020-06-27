FROM node:14.4-stretch

ENV NODE_ENV production
ENV PORT 3000

WORKDIR /usr/src/app
COPY "*" ./
COPY "source/" ./
COPY "assets/" ./

RUN npm install --production
RUN mv node_modules ../
RUN mv bower_components ../
COPY . .

EXPOSE 3000

CMD npm start
