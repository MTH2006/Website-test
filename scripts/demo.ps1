# ==============================================================================
# MINI CaaS PLATFORM - DEMO AUTOMATION SCRIPT (scripts/demo.ps1)
# ==============================================================================

param(
    [string]$Test = "ALL"
)

Write-Host "======================================================================" -ForegroundColor Cyan
Write-Host "  HE THONG KIEM THU TU DONG - DEMO LAB MINI CaaS (6 KICH BAN)" -ForegroundColor Cyan
Write-Host "======================================================================" -ForegroundColor Cyan
Write-Host ""

$backendUrl = "http://localhost:8088"

# 1. Kiem tra backend
try {
    $health = Invoke-RestMethod -Uri "$backendUrl/api/system/health" -TimeoutSec 3 -ErrorAction Stop
    if ($health.data.kubernetesStatus -ne "CONNECTED") {
        Write-Host "[ERROR] Kubernetes chua ket noi voi backend!" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "[ERROR] Khong the ket noi toi Backend tai $backendUrl. Vui long chay .\scripts\start.ps1 truoc." -ForegroundColor Red
    exit 1
}

# 2. Dang nhap lay JWT token (Xac thuc API bao mat)
Write-Host "-> Dang xac thuc tai khoan Quan tri vien (admin)..." -ForegroundColor Cyan
$loginPayload = @{ username = "admin"; password = "admin123" } | ConvertTo-Json
$loginResp = Invoke-RestMethod -Uri "$backendUrl/api/auth/login" -Method Post -Body $loginPayload -ContentType "application/json"
$token = $loginResp.data.token
$headers = @{ "Authorization" = "Bearer $token" }
Write-Host "-> Xac thuc thanh cong! JWT Bearer Token da san sang." -ForegroundColor Green
Write-Host ""

# 3. Lay danh sach bai test tu backend
$testListResp = Invoke-RestMethod -Uri "$backendUrl/api/demo-lab/tests" -Headers $headers
$tests = $testListResp.data

$testCodes = @(
    "TEST_01_RESOURCEQUOTA",
    "TEST_02_RBAC",
    "TEST_03_SECRET",
    "TEST_04_NETWORKPOLICY",
    "TEST_05_ADMISSION",
    "TEST_06_RESOURCE_CONTENTION"
)

function Run-SingleTest($code) {
    $t = $tests | Where-Object { $_.testCode -eq $code }
    $title = if ($t) { $t.name } else { $code }
    $desc = if ($t) { $t.description } else { "" }

    Write-Host "----------------------------------------------------------------------" -ForegroundColor DarkGray
    Write-Host ("[" + $code + "] " + $title) -ForegroundColor Yellow
    Write-Host ("Muc tieu: " + $desc) -ForegroundColor Gray
    Write-Host "Dang gui yeu cau kiem thu toi Kubernetes Cluster..." -ForegroundColor Cyan

    $sw = [System.Diagnostics.Stopwatch]::StartNew()
    try {
        $runResp = Invoke-RestMethod -Uri "$backendUrl/api/demo-lab/run-test/$code" -Method Post -Headers $headers -TimeoutSec 45
        $sw.Stop()
        $res = $runResp.data

        if ($res.status -eq "PASSED") {
            Write-Host "-> KET QUA: " -NoNewline
            Write-Host "DAT (PASSED)" -ForegroundColor Green -NoNewline
            Write-Host (" (Thoi gian: " + $sw.ElapsedMilliseconds + "ms)") -ForegroundColor DarkGray
        } else {
            Write-Host "-> KET QUA: " -NoNewline
            Write-Host "KHONG DAT (FAILED)" -ForegroundColor Red -NoNewline
            Write-Host (" (Thoi gian: " + $sw.ElapsedMilliseconds + "ms)") -ForegroundColor DarkGray
        }

        Write-Host "Bang chung ky thuat (Technical Evidence):" -ForegroundColor White
        $ev = if ($res.technicalEvidence) { $res.technicalEvidence } else { $res.evidence }
        Write-Host $ev -ForegroundColor DarkCyan
        Write-Host ""
        return $res
    } catch {
        $sw.Stop()
        Write-Host ("-> LOI KHI CHAY TEST: " + $_) -ForegroundColor Red
        return $null
    }
}

$results = @()

if ($Test -eq "ALL") {
    Write-Host "Bat dau chay toan bo 6 kich ban kiem thu CaaS..." -ForegroundColor Green
    Write-Host ""
    foreach ($c in $testCodes) {
        $r = Run-SingleTest $c
        if ($r) { $results += $r }
        Start-Sleep -Milliseconds 800
    }
} else {
    $idx = [int]$Test - 1
    $targetCode = $testCodes[$idx]
    $r = Run-SingleTest $targetCode
    if ($r) { $results += $r }
}

Write-Host "======================================================================" -ForegroundColor Cyan
Write-Host "  TONG KET KET QUA KIEM THU DEMO LAB TREN KUBERNETES THAT" -ForegroundColor Cyan
Write-Host "======================================================================" -ForegroundColor Cyan
foreach ($r in $results) {
    $statusColor = if ($r.status -eq "PASSED") { "Green" } else { "Red" }
    $dur = if ($r.durationMs) { $r.durationMs } else { $r.executionTimeMs }
    $tName = if ($r.testName) { $r.testName } else { $r.title }
    Write-Host ($r.testCode + " | ") -NoNewline
    Write-Host ($r.status + " | ") -ForegroundColor $statusColor -NoNewline
    Write-Host "$dur ms | $tName"
}
Write-Host "======================================================================" -ForegroundColor Cyan
Write-Host "Toan bo ket qua da duoc luu ben vung vao PostgreSQL!" -ForegroundColor Green
Write-Host "Xem chi tiet truc quan va so sanh tai: http://localhost:5173/history" -ForegroundColor Yellow
