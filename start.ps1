# Quick Start Script

Write-Host "==================================" -ForegroundColor Cyan
Write-Host "Factory Productivity Dashboard" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

# Check Docker
Write-Host "Checking Docker..." -ForegroundColor Yellow
$dockerInstalled = Get-Command docker -ErrorAction SilentlyContinue
if (-not $dockerInstalled) {
    Write-Host "ERROR: Docker is not installed!" -ForegroundColor Red
    Write-Host "Please install Docker Desktop from: https://www.docker.com/products/docker-desktop" -ForegroundColor Yellow
    exit 1
}

Write-Host "Docker found!" -ForegroundColor Green
Write-Host ""

# Check Docker Compose
Write-Host "Checking Docker Compose..." -ForegroundColor Yellow
$composeInstalled = Get-Command docker-compose -ErrorAction SilentlyContinue
if (-not $composeInstalled) {
    Write-Host "ERROR: Docker Compose is not installed!" -ForegroundColor Red
    exit 1
}

Write-Host "Docker Compose found!" -ForegroundColor Green
Write-Host ""

# Stop existing containers
Write-Host "Stopping any existing containers..." -ForegroundColor Yellow
docker-compose down -v 2>$null
Write-Host ""

# Build and start
Write-Host "Building and starting containers..." -ForegroundColor Yellow
Write-Host "This may take a few minutes on first run..." -ForegroundColor Gray
Write-Host ""
docker-compose up --build -d

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "==================================" -ForegroundColor Green
    Write-Host "Application started successfully!" -ForegroundColor Green
    Write-Host "==================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Frontend: http://localhost:3000" -ForegroundColor Cyan
    Write-Host "Backend:  http://localhost:5000" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Yellow
    Write-Host "1. Open http://localhost:3000 in your browser" -ForegroundColor White
    Write-Host "2. Register a new account" -ForegroundColor White
    Write-Host "3. Click 'Seed Data' to populate the dashboard" -ForegroundColor White
    Write-Host ""
    Write-Host "To view logs: docker-compose logs -f" -ForegroundColor Gray
    Write-Host "To stop: docker-compose down" -ForegroundColor Gray
} else {
    Write-Host ""
    Write-Host "ERROR: Failed to start containers!" -ForegroundColor Red
    Write-Host "Check the logs with: docker-compose logs" -ForegroundColor Yellow
    exit 1
}
