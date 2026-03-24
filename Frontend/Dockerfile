
FROM node:22-alpine AS builder

WORKDIR /app


ARG VITE_BACKEND_URL
ARG VITE_TILEMAP_KEY
ARG VITE_VIETMAP_SEARCH_KEY


ENV VITE_BACKEND_URL=$VITE_BACKEND_URL
ENV VITE_TILEMAP_KEY=$VITE_TILEMAP_KEY
ENV VITE_VIETMAP_SEARCH_KEY=$VITE_VIETMAP_SEARCH_KEY

RUN if [ -z "$VITE_VIETMAP_SEARCH_KEY" ]; then \
    echo "ERROR: VITE_VIETMAP_SEARCH_KEY is not set during build"; \
    exit 1; \
    fi


COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM node:22-alpine

WORKDIR /app

RUN npm install -g serve

COPY --from=builder /app/dist ./dist

ENV PORT=4173
EXPOSE 4173

CMD ["sh", "-c", "serve -s dist -l ${PORT}"]