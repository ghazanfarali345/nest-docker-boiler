# FROM node:18

# WORKDIR /app


# COPY ./package.json ./package.json

# RUN npm install --legacy-peer-deps

# COPY . .

# RUN npm run build

# CMD ["node", "dist/src/main.js"]

FROM node:alpine As development

WORKDIR /app

COPY package*.json ./

Run npm install -g @nestjs/cli

RUN npm install

COPY . .

RUN npm run build

FROM node:alpine as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /app

COPY package*.json ./

RUN npm install --only=production

COPY . .

COPY --from=development /usr/src/app/dist ./dist

CMD ["node", "dist/apps/user/main"]