# SHG-Mart Setup and Run Script
# This script will install dependencies and start both backend and frontend

Write-Host "🚀 SHG-Mart Setup Script" -ForegroundColor Cyan
Write-Host "=========================" -ForegroundColor Cyan
Write-Host ""

# Check if Node.js is installed
Write-Host "Checking Node.js installation..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js is installed: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js is not installed. Please install Node.js from https://nodejs.org" -ForegroundColor Red
    exit 1
}

# Check if MongoDB is running
Write-Host ""
Write-Host "⚠️  Make sure MongoDB is running before proceeding!" -ForegroundColor Yellow
Write-Host "   Local MongoDB: mongod" -ForegroundColor Gray
Write-Host "   Or use MongoDB Atlas connection string in backend/.env" -ForegroundColor Gray
Write-Host ""

$continue = Read-Host "Press Enter to continue or Ctrl+C to exit"

# Install Backend Dependencies
Write-Host ""
Write-Host "📦 Installing backend dependencies..." -ForegroundColor Yellow
Set-Location -Path "backend"
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Backend installation failed!" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Backend dependencies installed successfully!" -ForegroundColor Green

# Install Frontend Dependencies
Write-Host ""
Write-Host "📦 Installing frontend dependencies..." -ForegroundColor Yellow
Set-Location -Path "../frontend"
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Frontend installation failed!" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Frontend dependencies installed successfully!" -ForegroundColor Green

# Return to root
Set-Location -Path ".."

Write-Host ""
Write-Host "✨ Setup completed successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Next Steps:" -ForegroundColor Cyan
Write-Host "1. Update backend/.env with your configuration" -ForegroundColor White
Write-Host "2. Start MongoDB (if using local)" -ForegroundColor White
Write-Host "3. Run: cd backend && npm run dev" -ForegroundColor White
Write-Host "4. In new terminal: cd frontend && npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "🌐 Access the application:" -ForegroundColor Cyan
Write-Host "   Frontend: http://localhost:5173" -ForegroundColor White
Write-Host "   Backend:  http://localhost:5000" -ForegroundColor White
Write-Host ""
