FROM node:12-alpine3.10

WORKDIR /app/dev

COPY . .

RUN apk add --no-cache git

RUN git --version

RUN npm -v

# build app bundles
RUN npm i

RUN npm run build

EXPOSE 80

CMD ["npx", "http-server", "/app/dev/codebase", "-p", "80"]
