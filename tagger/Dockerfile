FROM node:16-alpine3.15  as builder
# lts-gallium
WORKDIR /app
RUN apk add --no-cache git
COPY . .
RUN npm i && npm run build 

FROM nginx:stable
RUN rm -f /usr/share/nginx/html/*
COPY --from=builder /app/codebase /usr/share/nginx/html
COPY ./conf/frontend/default.conf /etc/nginx/conf.d/
CMD ["nginx", "-g", "daemon off;"]
