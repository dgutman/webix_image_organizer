FROM node:12-alpine3.10

WORKDIR /app/dev

COPY package-lock.json /app/dev/

COPY package.json /app/dev

RUN apk add --no-cache git

RUN git --version

RUN npm -v

# build app bundles
RUN npm i

COPY . .

RUN npm run build


EXPOSE 80

CMD ["npx", "http-server", "/app/dev/codebase", "-p", "80"]


# FROM node:12-alpine3.10

# WORKDIR /app

# COPY . .

# RUN mkdir -p upload/archive

# RUN mkdir -p upload/images

# RUN mkdir -p upload/extract

# RUN mkdir -p tmp

# RUN npm -v

# RUN npm install pm2 -g

# # build app bundles
# RUN npm ci

# RUN cd ./client && npm i && npm run build-css

# EXPOSE 8000

# CMD ["pm2-runtime", "start", "ecosystem.config.js", "--env=production"]