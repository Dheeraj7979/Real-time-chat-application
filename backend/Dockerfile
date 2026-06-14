FROM node:alpine3.23
WORKDIR /src
COPY  package*.json ./
RUN npm install
COPY . .
EXPOSE 8000
CMD [ "npm","run","dev" ]