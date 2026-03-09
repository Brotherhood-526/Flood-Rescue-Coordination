FROM node:22-alpine AS builder

WORKDIR /app

# nhận biến từ Railway
ARG VITE_BACKEND_URL
ENV VITE_BACKEND_URL=$VITE_BACKEND_URL

COPY package*.json ./
RUN npm ci

COPY . .

RUN npm run build


FROM node:22-alpine

WORKDIR /app

RUN npm install -g serve

COPY --from=builder /app/dist ./dist

ENV PORT=4173

CMD ["sh", "-c", "serve -s dist -l ${PORT}"]