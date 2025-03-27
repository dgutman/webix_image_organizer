FROM node:22-alpine3.20  as builder 

WORKDIR /app/dev

COPY package.json .

RUN apk add --no-cache git

RUN git --version

RUN npm -v

# build app bundles
RUN npm i

RUN npm install pm2 -g

COPY . . 

RUN npm run build

EXPOSE 80

CMD ["pm2-runtime", "start", "pm2.config.js", "--env=production"]
