FROM node:12-alpine3.10

WORKDIR /app/dev

COPY . .

RUN apk add --no-cache git

RUN git --version

RUN npm -v

# build app bundles
RUN npm i

RUN npm install pm2 -g

RUN npm run build

EXPOSE 80

CMD ["pm2-runtime", "start", "pm2.config.js", "--env=production"]
