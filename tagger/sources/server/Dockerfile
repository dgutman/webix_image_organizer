FROM node:22-alpine3.20
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production && npm i pm2 -g
COPY sources/server/tagger ./server/tagger
COPY sources/utils ./utils
COPY sources/validationSchemas ./validationSchemas
COPY conf/pm2_backend/pm2.config.js .
CMD ["pm2-runtime", "pm2.config.js"]
