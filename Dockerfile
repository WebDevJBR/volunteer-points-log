FROM node:latest
EXPOSE 5000
COPY . .
RUN npm install
RUN npm run build:server
CMD ["node", "build/server.js"]
