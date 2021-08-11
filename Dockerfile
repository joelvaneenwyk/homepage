FROM heroku/heroku:20

ENV NODE_ENV production
ENV PORT 3000

RUN \
apt-get update \
&& apt-get install -y sudo wget build-essential gcc g++ make git curl

# Install NodeJS
RUN curl -sL https://deb.nodesource.com/setup_16.x | sudo -E bash -
RUN sudo apt-get install -y nodejs

# Install Yarn
RUN \
curl -sL https://dl.yarnpkg.com/debian/pubkey.gpg | gpg --dearmor | sudo tee /usr/share/keyrings/yarnkey.gpg >/dev/null \
&& echo "deb [signed-by=/usr/share/keyrings/yarnkey.gpg] https://dl.yarnpkg.com/debian stable main" | sudo tee /etc/apt/sources.list.d/yarn.list \
&& sudo apt-get update \
&& sudo apt-get install yarn

# Install Golang
RUN wget https://dl.google.com/go/go1.16.7.linux-amd64.tar.gz --directory-prefix=/tmp/
RUN sudo tar -xvf "/tmp/go1.16.7.linux-amd64.tar.gz" --directory "/tmp/" \
&& sudo mv "/tmp/go" "/usr/local"

ENV GOROOT="/usr/local/go"
ENV PATH="${GOROOT}/bin:${PATH}"
RUN go version

# Update environment so that when we 'go install' it outputs to this binary
# folder that is already in the PATH
RUN go env -w GOBIN=/usr/local/go/bin

# Install Hugo
RUN git clone -b "v0.87.0" --single-branch "https://github.com/gohugoio/hugo.git" "/tmp/hugo"
RUN cd "/tmp/hugo" && go install --tags extended
RUN hugo version

# Install TypeScript and 'tsc'
RUN yarn global add typescript

WORKDIR /usr/src/app

COPY . .

RUN yarn install
RUN yarn build

EXPOSE 3000

CMD node dist/server/server.js
