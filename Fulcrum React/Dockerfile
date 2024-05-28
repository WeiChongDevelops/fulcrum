# Build stage with an Alpine Node.js image
FROM node:22-alpine as build-stage
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy and build project
COPY . .
RUN npm run build --debug

# Copy static files into build directory
COPY public/static /app/dist/static

# Production stage to serve static files and run Express server
FROM node:22-alpine
WORKDIR /app

# Copy built static files and other files
COPY --from=build-stage /app/dist /app/dist
COPY server /app/server
COPY package*.json /app/

# Install production dependencies
RUN npm ci --omit=dev

EXPOSE 3001
CMD ["node", "server/server.js"]