FROM heroku/heroku:20

ENV NODE_ENV production
ENV PORT 3000

RUN \
apt-get update \
&& apt-get install -y sudo wget build-essential git curl

# Install NodeJS
RUN curl -sL https://deb.nodesource.com/setup_16.x | sudo -E bash -
RUN sudo apt-get install -y nodejs

# Install Golang
RUN \
wget https://dl.google.com/go/go1.16.7.linux-amd64.tar.gz \
&& sudo tar -xvf go1.16.7.linux-amd64.tar.gz \
&& sudo mv go /usr/local
ENV GOROOT="/usr/local/go"
ENV PATH="${GOPATH}/bin:${GOROOT}/bin:${PATH}"
RUN go version

# Install Hugo
RUN \
git clone -b "v0.87.0" --single-branch "https://github.com/gohugoio/hugo.git" "hugo" \
&& cd hugo \
&& go install --tags extended \
&& hugo --version

# Install Yarn
RUN npm install -g Yarn

# Install TypeScript and 'tsc'
RUN yarn global add typescript

WORKDIR /usr/src/app

COPY . .

RUN yarn install && yarn build

EXPOSE 3000

CMD node dist/server/server.js
