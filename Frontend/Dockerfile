FROM node:22-alpine AS builder

WORKDIR /app

# Nhận biến từ Railway
ARG VITE_BACKEND_URL
ENV VITE_BACKEND_URL=$VITE_BACKEND_URL

# Fail build nếu env không tồn tại
RUN if [ -z "$VITE_BACKEND_URL" ]; then \
    echo "ERROR: VITE_BACKEND_URL is not set"; \
    exit 1; \
    fi

# Copy dependency files trước để tận dụng cache
COPY package*.json ./

RUN npm ci

# Copy toàn bộ source
COPY . .

# Build Vite
RUN npm run build


# =========================
# Stage 2 — Run frontend
# =========================
FROM node:22-alpine

WORKDIR /app

# Cài static server
RUN npm install -g serve

# Copy build output
COPY --from=builder /app/dist ./dist

# Railway sẽ inject PORT
ENV PORT=4173

EXPOSE 4173

CMD ["sh", "-c", "serve -s dist -l ${PORT}"]