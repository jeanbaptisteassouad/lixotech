FROM node:23-alpine AS build

WORKDIR /app

COPY package.json .
COPY package-lock.json .

RUN npm install

COPY . .

RUN npm run build

FROM caddy:2.8.4-alpine

COPY --from=build /app/dist /app/dist

ENTRYPOINT ["caddy"]
CMD ["file-server", "--root", "/app/dist"]
