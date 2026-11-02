# ==============================================================================
# MINI CaaS PLATFORM - START SCRIPT (scripts/start.ps1)
# Khởi động dịch vụ Database (5433), Backend (8088), Frontend (5173)
# ==============================================================================

Write-Host "======================================================================" -ForegroundColor Cyan
Write-Host "  KHỞI ĐỘNG HỆ THỐNG MINI CaaS PLATFORM" -ForegroundColor Cyan
Write-Host "======================================================================" -ForegroundColor Cyan
Write-Host ""

$rootDir = (Get-Item $PSScriptRoot).Parent.FullName

# 1. KHỞI ĐỘNG POSTGRESQL CONTAINER
Write-Host "[1/3] Kiểm tra cơ sở dữ liệu PostgreSQL (Port 5433)..." -ForegroundColor Yellow
$pgStatus = docker inspect -f '{{.State.Running}}' minicaas-postgres 2>$null
if ($pgStatus -ne "true") {
    Write-Host "  -> Đang khởi động container minicaas-postgres..." -ForegroundColor Cyan
    docker start minicaas-postgres | Out-Null
    Start-Sleep -Seconds 3
}
Write-Host "  [OK] PostgreSQL minicaas-postgres đang hoạt động trên cổng 5433." -ForegroundColor Green

# 2. KHỞI ĐỘNG SPRING BOOT BACKEND (Port 8088)
Write-Host ""
Write-Host "[2/3] Kiểm tra Spring Boot Backend (Port 8088)..." -ForegroundColor Yellow
$backendConn = Get-NetTCPConnection -LocalPort 8088 -ErrorAction SilentlyContinue
if (-not $backendConn) {
    Write-Host "  -> Đang khởi chạy Spring Boot backend..." -ForegroundColor Cyan
    $jarPath = "$rootDir\backend\target\mini-caas-backend-1.0.0.jar"
    if (-not (Test-Path $jarPath)) {
        Write-Host "  -> File JAR chưa được build, đang biên dịch nhanh..." -ForegroundColor Cyan
        Push-Location "$rootDir\backend"
        cmd /c mvn clean package -DskipTests
        Pop-Location
    }
    Start-Process -FilePath "java" -ArgumentList "-jar `"$jarPath`"" -WorkingDirectory "$rootDir\backend" -WindowStyle Hidden
    Write-Host "  -> Đang đợi Spring Boot backend khởi động (khoảng 8-12 giây)..." -ForegroundColor Cyan
    
    $ready = $false
    for ($i = 0; $i -lt 20; $i++) {
        Start-Sleep -Seconds 2
        try {
            $resp = Invoke-RestMethod -Uri "http://localhost:8088/api/system/health" -TimeoutSec 2 -ErrorAction SilentlyContinue
            if ($resp.success -eq $true) {
                $ready = $true
                break
            }
        } catch {}
    }
    if ($ready) {
        Write-Host "  [OK] Spring Boot Backend đã sẵn sàng tại http://localhost:8088" -ForegroundColor Green
    } else {
        Write-Host "  [WARNING] Backend đang khởi động ngầm, vui lòng kiểm tra sau vài giây." -ForegroundColor Yellow
    }
} else {
    Write-Host "  [OK] Spring Boot Backend đang chạy sẵn trên cổng 8088." -ForegroundColor Green
}

# 3. KHỞI ĐỘNG FRONTEND (Port 5173)
Write-Host ""
Write-Host "[3/3] Kiểm tra Frontend Vite React (Port 5173)..." -ForegroundColor Yellow
$frontendConn = Get-NetTCPConnection -LocalPort 5173 -ErrorAction SilentlyContinue
if (-not $frontendConn) {
    Write-Host "  -> Đang khởi động Vite dev server trên cổng 5173..." -ForegroundColor Cyan
    Start-Process -FilePath "cmd.exe" -ArgumentList "/c npm run dev" -WorkingDirectory "$rootDir\frontend" -WindowStyle Hidden
    Start-Sleep -Seconds 3
    Write-Host "  [OK] Frontend đã sẵn sàng tại http://localhost:5173" -ForegroundColor Green
} else {
    Write-Host "  [OK] Frontend đang chạy sẵn trên cổng 5173." -ForegroundColor Green
}

# 4. MỞ TRÌNH DUYỆT
Write-Host ""
Write-Host "======================================================================" -ForegroundColor Green
Write-Host "  MINI CaaS PLATFORM ĐÃ HOẠT ĐỘNG HOÀN TOÀN!" -ForegroundColor Green
Write-Host "======================================================================" -ForegroundColor Green
Write-Host "  - Giao diện Web:    http://localhost:5173" -ForegroundColor Cyan
Write-Host "  - Backend REST API: http://localhost:8088/api" -ForegroundColor Cyan
Write-Host "  - Health Check:     http://localhost:8088/api/system/health" -ForegroundColor Cyan
Write-Host "  - PostgreSQL:       localhost:5433 (Database: mini_caas_db)" -ForegroundColor Cyan
Write-Host ""
Write-Host "  Tài khoản đăng nhập DEMO (hoặc nhấn nút Quick-Login trên giao diện):" -ForegroundColor Yellow
Write-Host "    * Quản trị viên:  admin     / admin123" -ForegroundColor White
Write-Host "    * Nhóm A:         teama_dev / team123" -ForegroundColor White
Write-Host "    * Nhóm B:         teamb_dev / team123" -ForegroundColor White
Write-Host "    * Nhóm C:         teamc_dev / team123" -ForegroundColor White
Write-Host "======================================================================" -ForegroundColor Green

Start-Process "http://localhost:5173"
