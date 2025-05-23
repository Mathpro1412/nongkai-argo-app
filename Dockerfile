# Stage 1: Build Stage
FROM node:22 AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# Stage 2: Runtime Stage
FROM node:22-slim

WORKDIR /app

COPY --from=builder /app .

CMD ["node", "main.js"]