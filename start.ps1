$backendDir  = "$PSScriptRoot\backend"
$frontendDir = "$PSScriptRoot\HospitalHuaycan"
$pingUrl     = "http://localhost:8080/api/auth/ping"
$loginUrl    = "http://localhost:8080/api/auth/login"

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Hospital Huaycan - Iniciando sistema  " -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "[1/3] Iniciando Backend (Spring Boot)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit","-Command","cd '$backendDir'; .\mvnw spring-boot:run -Dspring-boot.run.profiles=local"
Write-Host "      Esperando backend en puerto 8080..." -ForegroundColor Gray

$ready=$false; $maxWait=120; $elapsed=0
while (-not $ready -and $elapsed -lt $maxWait) {
    Start-Sleep -Seconds 3; $elapsed+=3
    try {
        if ((Invoke-RestMethod -Uri $pingUrl -Method GET -TimeoutSec 2 -EA Stop) -eq "pong") { $ready=$true }
    } catch { Write-Host "      [$elapsed s] Esperando..." -ForegroundColor DarkGray }
}
if (-not $ready) { Write-Host "[ERROR] Backend no respondio." -ForegroundColor Red; exit 1 }
Write-Host "      Backend OK -> http://localhost:8080" -ForegroundColor Green

Write-Host ""
Write-Host "[2/3] Probando login Supabase (admision1)..." -ForegroundColor Yellow
try {
    $login = Invoke-RestMethod -Uri $loginUrl -Method POST -ContentType "application/json" -Body '{"username":"admision1","password":"123456"}' -EA Stop
    Write-Host "      Supabase OK" -ForegroundColor Green
    Write-Host "      Usuario : $($login.username)" -ForegroundColor White
    Write-Host "      Nombre  : $($login.nombreCompleto)" -ForegroundColor White
    Write-Host "      Rol     : $($login.rol)" -ForegroundColor White
    Write-Host "      UserId  : $($login.userId)" -ForegroundColor White
    Write-Host "      JWT     : $($login.token.Substring(0,40))..." -ForegroundColor DarkGray
} catch { Write-Host "      [ERROR] Login fallido: $_" -ForegroundColor Red; exit 1 }

Write-Host ""
Write-Host "[3/3] Iniciando Frontend (Vite)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit","-Command","cd '$frontendDir'; npm run dev"

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  Sistema listo!                       " -ForegroundColor Green
Write-Host "  Backend  -> http://localhost:8080    " -ForegroundColor Green
Write-Host "  Frontend -> http://localhost:5173    " -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green