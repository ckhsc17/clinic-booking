# frontend/Dockerfile

FROM node:21.5.0-alpine AS builder

WORKDIR /booking-frontend
COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM node:21.5.0-alpine

WORKDIR /booking-frontend
COPY --from=builder /booking-frontend .

EXPOSE 3000
CMD ["npm", "start"]