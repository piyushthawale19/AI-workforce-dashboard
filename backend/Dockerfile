# Use Debian-based Node image instead of Alpine for better Prisma compatibility
FROM node:20-bookworm-slim

# Install OpenSSL 3.x and other dependencies required by Prisma
RUN apt-get update -y && \
    apt-get install -y openssl libssl3 ca-certificates && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies
RUN npm install

# Copy application code
COPY . .

# Generate Prisma Client with correct binary targets
RUN npm run prisma:generate

# Build TypeScript
RUN npm run build

EXPOSE 5000

# Run migrations and start server
CMD ["sh", "-c", "npm run prisma:push && npm start"]
