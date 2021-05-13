FROM node:12-alpine3.10

WORKDIR /app

COPY . .

RUN mkdir -p upload/archive

RUN mkdir -p upload/images

RUN mkdir -p upload/extract

RUN mkdir -p tmp

RUN npm -v

RUN npm install pm2 -g

# build app bundles
RUN npm i

EXPOSE 8000

CMD ["pm2-runtime", "index.js"]