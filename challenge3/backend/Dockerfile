FROM node:23-alpine

WORKDIR /app

COPY package.json .
COPY package-lock.json .

RUN npm install

COPY . .

CMD ["node", "--experimental-strip-types", "src/index.ts"]
