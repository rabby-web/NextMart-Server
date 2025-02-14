
FROM node:20-alpine

WORKDIR /application

COPY package*.json yarn.lock ./

RUN yarn install --frozen-lockfile

COPY . .

RUN yarn build

EXPOSE 3001

CMD ["yarn", "dev"]
