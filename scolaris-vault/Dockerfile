FROM node:20-bookworm-slim

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .

USER node

EXPOSE 5003

CMD ["node", "server.js"]
