# --- Stage 1: Build the frontend ---
FROM node:20-alpine AS frontend-builder
WORKDIR /app
COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY . .
RUN npm run build

# --- Stage 2: Run the server ---
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --omit=dev --legacy-peer-deps
COPY . .
# Copy the built frontend from the previous stage
COPY --from=frontend-builder /app/dist ./dist

EXPOSE 8787
CMD ["node", "server/index.mjs"]
