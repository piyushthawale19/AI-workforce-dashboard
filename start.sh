#!/bin/bash

echo "=================================="
echo "Factory Productivity Dashboard"
echo "=================================="
echo ""

# Check Docker
echo "Checking Docker..."
if ! command -v docker &> /dev/null; then
    echo "ERROR: Docker is not installed!"
    echo "Please install Docker from: https://www.docker.com/get-started"
    exit 1
fi

echo "Docker found!"
echo ""

# Check Docker Compose
echo "Checking Docker Compose..."
if ! command -v docker-compose &> /dev/null; then
    echo "ERROR: Docker Compose is not installed!"
    exit 1
fi

echo "Docker Compose found!"
echo ""

# Stop existing containers
echo "Stopping any existing containers..."
docker-compose down -v 2>/dev/null
echo ""

# Build and start
echo "Building and starting containers..."
echo "This may take a few minutes on first run..."
echo ""
docker-compose up --build -d

if [ $? -eq 0 ]; then
    echo ""
    echo "=================================="
    echo "Application started successfully!"
    echo "=================================="
    echo ""
    echo "Frontend: http://localhost:3000"
    echo "Backend:  http://localhost:5000"
    echo ""
    echo "Next steps:"
    echo "1. Open http://localhost:3000 in your browser"
    echo "2. Register a new account"
    echo "3. Click 'Seed Data' to populate the dashboard"
    echo ""
    echo "To view logs: docker-compose logs -f"
    echo "To stop: docker-compose down"
else
    echo ""
    echo "ERROR: Failed to start containers!"
    echo "Check the logs with: docker-compose logs"
    exit 1
fi
