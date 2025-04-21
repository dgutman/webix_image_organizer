FROM node:22-alpine3.20

WORKDIR /app

COPY package.json ./

COPY package-lock.json ./

RUN apk add --no-cache git

RUN git --version

RUN npm -v

# build app bundles
RUN npm install

RUN npm install react-scripts@5.0.1 -g

COPY . ./

EXPOSE 3000

CMD ["npm", "start"]
