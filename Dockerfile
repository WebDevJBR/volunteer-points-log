FROM node:latest
EXPOSE 5000
COPY . .
RUN npm install
WORKDIR client
RUN npm install
WORKDIR ..
RUN npm run build
WORKDIR build
CMD ["node", "server.js"]
