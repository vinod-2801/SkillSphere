# SkillSphere - Easy Single-Command Launcher for Windows PowerShell
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "🚀 Starting SkillSphere - Team INNOVEX (SIH 2026)" -ForegroundColor Green
Write-Host "==========================================================" -ForegroundColor Cyan

$nodePath = "C:\Users\Admin\.gemini\antigravity\tools\nodejs"
if (Test-Path $nodePath) {
    $env:Path = "$nodePath;$env:Path"
}

# Ensure backend dependencies exist
if (!(Test-Path "$PSScriptRoot\backend\node_modules")) {
    Write-Host "`n📦 Installing Backend dependencies..." -ForegroundColor Yellow
    Push-Location "$PSScriptRoot\backend"
    & npm install
    Pop-Location
}

# Ensure frontend dependencies exist
if (!(Test-Path "$PSScriptRoot\frontend\node_modules")) {
    Write-Host "`n📦 Installing Frontend dependencies..." -ForegroundColor Yellow
    Push-Location "$PSScriptRoot\frontend"
    & npm install
    Pop-Location
}

Write-Host "`n1. Running AI Automated Tests..." -ForegroundColor Yellow
& node backend/tests/aiServices.test.js
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Tests failed. Please check errors above." -ForegroundColor Red
    exit 1
}

Write-Host "`n2. Starting Backend Server on http://localhost:5000..." -ForegroundColor Yellow
$backendJob = Start-Process powershell -ArgumentList "-NoExit", "-Command", "`$env:Path = '$nodePath;' + `$env:Path; cd '$PSScriptRoot\backend'; node server.js" -PassThru

Start-Sleep -Seconds 2

Write-Host "`n3. Starting Frontend Vite Server on http://localhost:5173..." -ForegroundColor Yellow
$frontendJob = Start-Process powershell -ArgumentList "-NoExit", "-Command", "`$env:Path = '$nodePath;' + `$env:Path; cd '$PSScriptRoot\frontend'; npm run dev" -PassThru

Write-Host "`n✅ SkillSphere is running!" -ForegroundColor Green
Write-Host "   Frontend UI:  http://localhost:5173" -ForegroundColor Cyan
Write-Host "   Backend API:  http://localhost:5000" -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan
