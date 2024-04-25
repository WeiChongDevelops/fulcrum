# Build stage with an Alpine Node.js image
FROM node:16-alpine as build-stage
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install --verbose

# Copy the whole project and build it
COPY . .
RUN npm run build --verbose

# Copy static files into the build directory for easy transfer to the next stage
COPY ./static /app/dist/static

# Production stage to serve static files using Nginx
FROM nginx:1.21-alpine
COPY nginx.conf /etc/nginx/nginx.conf

# Ensure both built application files and static files are copied to Nginx root
COPY --from=build-stage /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]