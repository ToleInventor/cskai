# Stage 1: Build the frontend application
FROM node:22-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

COPY . .

# Changed from CMD to RUN so the build happens during the docker build process
RUN npm run build

# Stage 2: Serve the compiled static assets with Nginx
# Fixed the typos in "nginx" and "alpine"
FROM nginx:alpine

# Copy the built assets from the first stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose Nginx default web port
EXPOSE 80

# Ensure Nginx runs continuously in the foreground
CMD ["nginx", "-g", "daemon off;"]
