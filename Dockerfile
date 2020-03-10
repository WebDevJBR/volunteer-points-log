FROM node:latest
EXPOSE 80
COPY . .
RUN npm install
WORKDIR client
RUN npm install
WORKDIR ..
RUN npm run build
CMD ["node", "build/server.js"]

