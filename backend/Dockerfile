## Dockerfile for kitchen19 backend
# Build a small production image
FROM node:20-alpine

# Create app directory
WORKDIR /usr/src/app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm ci --only=production

# Copy source
COPY . .

# Expose port and set production env
ENV NODE_ENV=production
EXPOSE 4000

# Start the server
CMD ["node", "server.js"]
