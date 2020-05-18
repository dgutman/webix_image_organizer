# Use an official Python runtime as a parent image
FROM baturik/base_ubuntu_image:v2

# Set the working directory to /app
WORKDIR /app

COPY package*.json ./

RUN npm install --only=production

COPY sources/server/tagger ./server/tagger

COPY sources/utils ./utils

RUN npm install pm2 -g

COPY conf/pm2_backend/pm2.config.js ./

EXPOSE 4000

# RUN npm run build

CMD [ "pm2-runtime", "pm2.config.js" ]
