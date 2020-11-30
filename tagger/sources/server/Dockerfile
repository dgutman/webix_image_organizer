FROM node:12-alpine3.10

# Set the working directory to /app
WORKDIR /app

COPY package*.json ./

RUN npm install --only=production

COPY sources/server/tagger ./server/tagger

COPY sources/utils ./utils

COPY sources/validationSchemas ./validationSchemas

RUN npm install pm2 -g

COPY conf/pm2_backend/pm2.config.js ./

EXPOSE 4000

CMD [ "pm2-runtime", "pm2.config.js" ]
