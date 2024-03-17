FROM node:18

WORKDIR /app


COPY ./package.json ./package.json

RUN npm install --legacy-peer-deps

COPY . .

CMD ["node", "dist/src/main.js"]