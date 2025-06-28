FROM node:18-alpine

ARG ADMIN_API_KEY

ENV ADMIN_API_KEY=$ADMIN_API_KEY

WORKDIR /app

COPY package.json ./
RUN npm install

COPY . .

EXPOSE 4000
CMD ["npm", "start"]
