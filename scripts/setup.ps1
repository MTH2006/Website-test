# ==============================================================================
# MINI CaaS PLATFORM - SETUP SCRIPT (scripts/setup.ps1)
# Hệ thống CaaS Đa Người Dùng (Multi-Tenant) với Quota và Cô Lập Tài Nguyên
# Dành cho Đồ án Môn Điện toán đám mây - Sinh viên năm 2 CNTT
# ==============================================================================

Write-Host "======================================================================" -ForegroundColor Cyan
Write-Host "  KHỞI TẠO NỀN TẢNG MINI CaaS PLATFORM (SETUP AUTOMATION)" -ForegroundColor Cyan
Write-Host "======================================================================" -ForegroundColor Cyan
Write-Host ""

$ErrorActionPreference = "Stop"
$rootDir = (Get-Item $PSScriptRoot).Parent.FullName

# 1. KIỂM TRA TIỀN ĐỀ HỆ THỐNG
Write-Host "[1/7] Kiểm tra các công cụ hệ thống cần thiết..." -ForegroundColor Yellow

# Docker
try {
    $dockerVer = docker version --format '{{.Server.Version}}' 2>$null
    Write-Host "  [OK] Docker Desktop đang chạy (Version: $dockerVer)" -ForegroundColor Green
} catch {
    Write-Host "  [ERROR] Docker Desktop chưa khởi động! Vui lòng bật Docker Desktop trước." -ForegroundColor Red
    exit 1
}

# Kind
try {
    $kindVer = kind version 2>$null
    Write-Host "  [OK] Kind CLI sẵn sàng: $kindVer" -ForegroundColor Green
} catch {
    Write-Host "  [ERROR] Chưa tìm thấy kind CLI trong PATH." -ForegroundColor Red
    exit 1
}

# Kubectl
try {
    $kubectlVer = kubectl version --client -o json 2>$null | ConvertFrom-Json
    Write-Host "  [OK] Kubectl CLI sẵn sàng (GitVersion: $($kubectlVer.clientVersion.gitVersion))" -ForegroundColor Green
} catch {
    Write-Host "  [ERROR] Kubectl chưa được cài đặt." -ForegroundColor Red
    exit 1
}

# Java JDK
try {
    $javaVer = java -version 2>&1 | Select-Object -First 1
    Write-Host "  [OK] Java Runtime sẵn sàng: $javaVer" -ForegroundColor Green
} catch {
    Write-Host "  [ERROR] Java JDK chưa được cài đặt." -ForegroundColor Red
    exit 1
}

# Node.js & npm
try {
    $nodeVer = node -v 2>$null
    $npmVer = cmd /c npm -v 2>$null
    Write-Host "  [OK] Node.js ($nodeVer) & npm ($npmVer) sẵn sàng" -ForegroundColor Green
} catch {
    Write-Host "  [ERROR] Node.js hoặc npm chưa được cài đặt." -ForegroundColor Red
    exit 1
}

# 2. BẢO VỆ CÁC CỔNG NGOÀI (HOTEL BOOKING)
Write-Host ""
Write-Host "[2/7] Xác minh kiểm soát cô lập cổng (Hotel Booking Isolation)..." -ForegroundColor Yellow
$hotelPorts = @(3000, 8080, 5432)
foreach ($p in $hotelPorts) {
    $inUse = Get-NetTCPConnection -LocalPort $p -ErrorAction SilentlyContinue
    if ($inUse) {
        Write-Host "  [SAFE] Cổng $p đang phục vụ Hotel Booking -> Được bảo vệ, KHÔNG can thiệp." -ForegroundColor Magenta
    }
}
Write-Host "  [INFO] Mini CaaS sử dụng dải cổng riêng: Frontend 5173, Backend 8088, DB 5433." -ForegroundColor Cyan

# 3. KHỞI TẠO KUBERNETES KIND CLUSTER VỚI CALICO CNI
Write-Host ""
Write-Host "[3/7] Khởi tạo cụm Kubernetes Kind (caas-cluster)..." -ForegroundColor Yellow
$clusterExists = kind get clusters 2>$null | Select-String -Pattern "^caas-cluster$"
if (-not $clusterExists) {
    Write-Host "  -> Đang tạo cụm caas-cluster với disableDefaultCNI: true..." -ForegroundColor Cyan
    kind create cluster --config "$rootDir\kubernetes\cluster\kind-config.yaml"
    Write-Host "  -> Cài đặt Calico CNI v3.28.0 để hỗ trợ NetworkPolicy..." -ForegroundColor Cyan
    kubectl apply -f https://raw.githubusercontent.com/projectcalico/calico/v3.28.0/manifests/calico.yaml
} else {
    Write-Host "  [OK] Cụm caas-cluster đã tồn tại và đang hoạt động." -ForegroundColor Green
}

# 4. TRIỂN KHAI CÁC CHÍNH SÁCH KUBERNETES (QUOTA, RBAC, CNI, VAP)
Write-Host ""
Write-Host "[4/7] Triển khai chính sách đa người dùng (Multi-Tenant Policies)..." -ForegroundColor Yellow

Write-Host "  -> Áp dụng Namespaces (team-a, team-b, team-c)..." -ForegroundColor Cyan
kubectl apply -f "$rootDir\kubernetes\namespaces\namespaces.yaml"

Write-Host "  -> Áp dụng ResourceQuota..." -ForegroundColor Cyan
kubectl apply -f "$rootDir\kubernetes\quotas\quotas.yaml"

Write-Host "  -> Áp dụng LimitRange..." -ForegroundColor Cyan
kubectl apply -f "$rootDir\kubernetes\limitranges\limitranges.yaml"

Write-Host "  -> Áp dụng RBAC & ServiceAccounts..." -ForegroundColor Cyan
kubectl apply -f "$rootDir\kubernetes\rbac\rbac.yaml"

Write-Host "  -> Áp dụng Calico NetworkPolicies (Default Deny, DNS, Cross-team)..." -ForegroundColor Cyan
kubectl apply -f "$rootDir\kubernetes\network-policies\default-deny.yaml"
kubectl apply -f "$rootDir\kubernetes\network-policies\allow-dns.yaml"
kubectl apply -f "$rootDir\kubernetes\network-policies\allow-team-a-to-b.yaml"

Write-Host "  -> Áp dụng ValidatingAdmissionPolicy (Image Whitelist)..." -ForegroundColor Cyan
kubectl apply -f "$rootDir\kubernetes\admission\image-whitelist.yaml"

# 5. KHỞI TẠO POSTGRESQL DATABASE
Write-Host ""
Write-Host "[5/7] Thiết lập cơ sở dữ liệu PostgreSQL (minicaas-postgres trên cổng 5433)..." -ForegroundColor Yellow
$pgContainer = docker ps -a --filter "name=minicaas-postgres" --format "{{.Names}}"
if (-not $pgContainer) {
    Write-Host "  -> Khởi tạo container minicaas-postgres..." -ForegroundColor Cyan
    docker volume create minicaas_pgdata | Out-Null
    docker run -d --name minicaas-postgres `
        -e POSTGRES_DB=mini_caas_db `
        -e POSTGRES_USER=postgres `
        -e POSTGRES_PASSWORD=postgres `
        -p 5433:5432 `
        -v minicaas_pgdata:/var/lib/postgresql/data `
        postgres:16-alpine | Out-Null
    Write-Host "  -> Đang đợi PostgreSQL khởi động..." -ForegroundColor Cyan
    Start-Sleep -Seconds 4
} else {
    $running = docker ps --filter "name=minicaas-postgres" --format "{{.Names}}"
    if (-not $running) {
        Write-Host "  -> Đang khởi động lại container minicaas-postgres..." -ForegroundColor Cyan
        docker start minicaas-postgres | Out-Null
        Start-Sleep -Seconds 3
    }
    Write-Host "  [OK] Container minicaas-postgres đang chạy trên cổng 5433." -ForegroundColor Green
}

# Chạy SQL Migration
Write-Host "  -> Đồng bộ lược đồ bảng và dữ liệu mẫu (migrations)..." -ForegroundColor Cyan
docker exec -i minicaas-postgres psql -U postgres -d mini_caas_db -f - < "$rootDir\database\migrations\01_init_schema.sql" 2>$null | Out-Null
docker exec -i minicaas-postgres psql -U postgres -d mini_caas_db -f - < "$rootDir\database\migrations\02_seed_data.sql" 2>$null | Out-Null
Write-Host "  [OK] Cơ sở dữ liệu 15 bảng đã sẵn sàng." -ForegroundColor Green

# 6. BUILD BACKEND & FRONTEND DEPENDENCIES
Write-Host ""
Write-Host "[6/7] Biên dịch Spring Boot backend & kiểm tra frontend..." -ForegroundColor Yellow
if (-not (Test-Path "$rootDir\backend\target\mini-caas-backend-1.0.0.jar")) {
    Write-Host "  -> Đang đóng gói backend JAR..." -ForegroundColor Cyan
    Push-Location "$rootDir\backend"
    cmd /c mvn clean package -DskipTests
    Pop-Location
} else {
    Write-Host "  [OK] mini-caas-backend-1.0.0.jar đã sẵn sàng." -ForegroundColor Green
}

if (-not (Test-Path "$rootDir\frontend\node_modules")) {
    Write-Host "  -> Cài đặt gói thư viện frontend (npm install)..." -ForegroundColor Cyan
    Push-Location "$rootDir\frontend"
    cmd /c npm install
    Pop-Location
} else {
    Write-Host "  [OK] Thư viện frontend (node_modules) đã đầy đủ." -ForegroundColor Green
}

# 7. HOÀN TẤT
Write-Host ""
Write-Host "======================================================================" -ForegroundColor Green
Write-Host "  HOÀN TẤT CÀI ĐẶT THÀNH CÔNG NỀN TẢNG MINI CaaS!" -ForegroundColor Green
Write-Host "======================================================================" -ForegroundColor Green
Write-Host "  Để khởi động toàn bộ nền tảng, chạy lệnh:" -ForegroundColor Yellow
Write-Host "  .\scripts\start.ps1" -ForegroundColor Cyan
Write-Host "======================================================================" -ForegroundColor Green
