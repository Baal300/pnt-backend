FROM node:current-alpine3.22

WORKDIR /usr/src/backend
EXPOSE 8080
COPY . .

RUN npm install
CMD ["npm", "run", "server"]