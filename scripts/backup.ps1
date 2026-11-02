# ==============================================================================
# MINI CaaS PLATFORM - DATABASE BACKUP SCRIPT (scripts/backup.ps1)
# Sao lưu an toàn cơ sở dữ liệu PostgreSQL (minicaas) vào database/backup/
# ==============================================================================

Write-Host "======================================================================" -ForegroundColor Cyan
Write-Host "  SAO LUU CO SO DU LIEU POSTGRESQL (MINI CaaS DATABASE)" -ForegroundColor Cyan
Write-Host "======================================================================" -ForegroundColor Cyan
Write-Host ""

$rootDir = (Get-Item $PSScriptRoot).Parent.FullName
$backupDir = "$rootDir\database\backup"

if (-not (Test-Path $backupDir)) {
    New-Item -ItemType Directory -Path $backupDir -Force | Out-Null
}

$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$backupFile = "$backupDir\minicaas_backup_$timestamp.sql"

Write-Host "-> Dang thuc hien sao luu tu container minicaas-postgres..." -ForegroundColor Yellow

$pgRunning = docker ps --filter "name=minicaas-postgres" --format "{{.Names}}"
if (-not $pgRunning) {
    Write-Host "[ERROR] Container minicaas-postgres khong chay. Vui long bat lai container truoc khi backup." -ForegroundColor Red
    exit 1
}

docker exec -i minicaas-postgres pg_dump -U minicaas_admin -d minicaas > $backupFile

if (Test-Path $backupFile) {
    $fileSize = (Get-Item $backupFile).Length
    Write-Host "======================================================================" -ForegroundColor Green
    Write-Host "  SAO LUU THANH CONG!" -ForegroundColor Green
    Write-Host "  File sao luu: $backupFile" -ForegroundColor Cyan
    Write-Host "  Kich thuoc:   $([math]::Round($fileSize / 1KB, 2)) KB" -ForegroundColor Cyan
    Write-Host "======================================================================" -ForegroundColor Green
} else {
    Write-Host "[ERROR] Khong tao duoc file sao luu." -ForegroundColor Red
}
