FROM node:18.12.1-alpine
WORKDIR /usr/src/app
COPY package*.json server.js ./
RUN npm install
COPY . .
EXPOSE 9000
CMD ["node", "server.js"]
