
FROM node:18-alpine AS builder


WORKDIR /app


COPY package*.json ./
RUN npm install --frozen-lockfile


COPY tsconfig*.json ./
COPY src ./src


RUN npm run build


FROM node:18-alpine


WORKDIR /app


COPY package*.json ./
COPY --from=builder /app/dist ./dist


RUN npm ci --production


EXPOSE 3000


CMD [ "npm","run","start" ]