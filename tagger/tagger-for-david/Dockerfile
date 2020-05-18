# Ubuntu:18.04 with node:12, git and nginx
# It's better to make your own base image based on ./conf/base_image/Dockerfile
FROM baturik/base_ubuntu_image:v2

WORKDIR /app/dev

COPY . .

# build app bundles 
RUN npm install

RUN npm run build

RUN cp -a codebase/. ../codebase

RUN rm -rf dev

# NGINX issues
RUN mkdir -p /etc/nginx/sites-available

RUN rm -rf /etc/nginx/sites-enabled/default

RUN ln -s /etc/nginx/sites-available/tagger.conf  /etc/nginx/sites-enabled/tagger.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
