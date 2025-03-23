# Backend Dockerfile
# backend/Dockerfile
FROM node:18-alpine AS backend

WORKDIR /usr/src/app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy app source
COPY . .

# Set environment variables
ENV NODE_ENV=production

# Expose the API port
EXPOSE 3000

# Start the app
CMD ["node", "src/index.js"]

# Mobile App Dockerfile
# mobile/Dockerfile
FROM node:18-alpine AS mobile-builder

WORKDIR /usr/src/app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci

# Copy app source
COPY . .

# Build the app for production
RUN npm run build

