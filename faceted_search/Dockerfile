FROM node:22-alpine3.20

WORKDIR /app

RUN mkdir -p upload/archive

RUN mkdir -p upload/images

RUN mkdir -p upload/extract

RUN mkdir -p tmp

#RUN cp -p sample_config.js config.js


RUN npm install pm2 -g

COPY . .

RUN npm -v
# build app bundles
RUN npm ci

RUN cd ./client && npm i && npm run build-css

EXPOSE 8000

CMD ["pm2-runtime", "start", "pm2.config.js", "--env=production"]
