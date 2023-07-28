FROM node:20-alpine3.17

# create root application folder
WORKDIR /app

# copy configs to /app folder
COPY package*.json ./
COPY tsconfig.json ./

RUN yarn

# copy source code to /app/src folder
COPY src /app/src
RUN yarn build

EXPOSE 8080

CMD [ "node", "./build/dist/index.js" ]