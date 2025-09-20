FROM node:current-alpine3.22

WORKDIR /usr/src/backend
EXPOSE 8080
RUN npm install
COPY . .

CMD ["npm", "run", "server"]