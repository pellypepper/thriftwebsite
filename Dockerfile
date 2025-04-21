# Step 1: Build frontend
FROM node:18 AS frontend
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ .
RUN npm run build

# Step 2: Backend server
FROM node:18

WORKDIR /app

# Copy backend code
COPY backend ./backend
WORKDIR /app/backend

# Copy frontend build to backend/public
COPY --from=frontend /app/frontend/dist ./public

# Install backend deps
COPY backend/package*.json ./
RUN npm install

# Set PORT and expose
ENV PORT=8080
EXPOSE 8080

CMD ["node", "server.js"]
