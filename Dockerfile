# Step 1: Build
FROM node:20 AS builder

WORKDIR /app

COPY package*.json ./
COPY tsconfig.json ./

COPY ./src ./src
COPY ./tenshi ./tenshi
COPY ./tenshi/data/json ./tenshi/data/json
COPY ./automation ./automation
COPY ./tenshi-config.json ./
COPY ./src/data/json ./src/data/json
COPY ./src/templates ./src/templates

RUN npm install
RUN npm run build

# Step 2: Prod
FROM node:20-alpine

WORKDIR /app

COPY --from=builder /app /app

RUN npm install --omit=dev

CMD ["npm", "run", "prod"]
