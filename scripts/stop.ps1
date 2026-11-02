# ==============================================================================
# MINI CaaS PLATFORM - STOP SCRIPT (scripts/stop.ps1)
# Dừng an toàn các dịch vụ Mini CaaS (Backend 8088, Frontend 5173, DB 5433)
# TUYỆT ĐỐI KHÔNG ẢNH HƯỞNG ĐẾN HỆ THỐNG HOTEL BOOKING (3000, 8080, 5432)
# ==============================================================================

Write-Host "======================================================================" -ForegroundColor Cyan
Write-Host "  DỪNG DỊCH VỤ NỀN TẢNG MINI CaaS PLATFORM" -ForegroundColor Cyan
Write-Host "======================================================================" -ForegroundColor Cyan
Write-Host ""

# 1. DỪNG FRONTEND DEV SERVER (Port 5173)
Write-Host "[1/3] Đang tìm và dừng Frontend trên cổng 5173..." -ForegroundColor Yellow
$frontendConns = Get-NetTCPConnection -LocalPort 5173 -ErrorAction SilentlyContinue
if ($frontendConns) {
    $pids = $frontendConns | Select-Object -ExpandProperty OwningProcess -Unique
    foreach ($procId in $pids) {
        try {
            Stop-Process -Id $procId -Force -ErrorAction SilentlyContinue
            Write-Host "  [OK] Đã dừng tiến trình Frontend PID: $procId" -ForegroundColor Green
        } catch {}
    }
} else {
    Write-Host "  [INFO] Không có tiến trình nào đang chạy trên cổng 5173." -ForegroundColor Gray
}

# 2. DỪNG SPRING BOOT BACKEND (Port 8088)
Write-Host ""
Write-Host "[2/3] Đang tìm và dừng Spring Boot Backend trên cổng 8088..." -ForegroundColor Yellow
$backendConns = Get-NetTCPConnection -LocalPort 8088 -ErrorAction SilentlyContinue
if ($backendConns) {
    $pids = $backendConns | Select-Object -ExpandProperty OwningProcess -Unique
    foreach ($procId in $pids) {
        try {
            Stop-Process -Id $procId -Force -ErrorAction SilentlyContinue
            Write-Host "  [OK] Đã dừng tiến trình Backend PID: $procId" -ForegroundColor Green
        } catch {}
    }
} else {
    Write-Host "  [INFO] Không có tiến trình nào đang chạy trên cổng 8088." -ForegroundColor Gray
}

# 3. DỪNG POSTGRES CONTAINER (Tùy chọn)
Write-Host ""
Write-Host "[3/3] Tạm dừng container minicaas-postgres (giữ nguyên dữ liệu volume)..." -ForegroundColor Yellow
$pgContainer = docker ps --filter "name=minicaas-postgres" --format "{{.Names}}"
if ($pgContainer) {
    docker stop minicaas-postgres | Out-Null
    Write-Host "  [OK] Container minicaas-postgres đã tạm dừng (Dữ liệu an toàn trong Docker Volume)." -ForegroundColor Green
} else {
    Write-Host "  [INFO] Container minicaas-postgres đã ở trạng thái dừng." -ForegroundColor Gray
}

# 4. BẢO VỆ HOTEL BOOKING
Write-Host ""
Write-Host "======================================================================" -ForegroundColor Green
Write-Host "  TẤT CẢ DỊCH VỤ MINI CaaS ĐÃ ĐƯỢC DỪNG AN TOÀN." -ForegroundColor Green
Write-Host "  Hệ thống Hotel Booking (Cổng 3000, 8080, 5432) được giữ nguyên vẹn 100%." -ForegroundColor Magenta
Write-Host "======================================================================" -ForegroundColor Green
