# ==============================================================================
# MINI CaaS PLATFORM - RESET DEMO SCRIPT (scripts/reset-demo.ps1)
# Dọn dẹp an toàn các Pods/Deployments thử nghiệm phát sinh sau khi chạy Demo Lab
# KHÔNG XÓA CỤM KUBERNETES, KHÔNG XÓA NAMESPACES, KHÔNG XÓA DATABASE
# ==============================================================================

Write-Host "======================================================================" -ForegroundColor Cyan
Write-Host "  DỌN DẸP AN TOÀN TÀI NGUYÊN KIỂM THỬ (CLEANUP TEST WORKLOADS)" -ForegroundColor Cyan
Write-Host "======================================================================" -ForegroundColor Cyan
Write-Host ""

$namespaces = @("team-a", "team-b", "team-c")
$targetWorkloadNames = @(
    "stress-app",
    "blocked-nginx",
    "cross-probe",
    "unapproved-miner",
    "app-template-test",
    "test-quota-probe",
    "test-limit-pod"
)

foreach ($ns in $namespaces) {
    Write-Host "-> Đang kiểm tra dọn dẹp trong Namespace [$ns]..." -ForegroundColor Yellow
    
    # Xóa các Pods có label temp-test=true
    kubectl delete pods -n $ns -l temp-test=true --grace-period=0 --force 2>$null | Out-Null
    
    # Xóa theo tên cụ thể nếu có
    foreach ($name in $targetWorkloadNames) {
        $pod = kubectl get pod $name -n $ns --ignore-not-found 2>$null
        if ($pod) {
            Write-Host "  - Đang xóa Pod thử nghiệm: $name..." -ForegroundColor Gray
            kubectl delete pod $name -n $ns --grace-period=0 --force 2>$null | Out-Null
        }
        $dep = kubectl get deployment $name -n $ns --ignore-not-found 2>$null
        if ($dep) {
            Write-Host "  - Đang xóa Deployment thử nghiệm: $name..." -ForegroundColor Gray
            kubectl delete deployment $name -n $ns 2>$null | Out-Null
        }
    }
}

Write-Host ""
Write-Host "======================================================================" -ForegroundColor Green
Write-Host "  DỌN DẸP HOÀN TẤT!" -ForegroundColor Green
Write-Host "  Hệ thống đã trở về trạng thái sạch sẽ ban đầu, sẵn sàng cho lượt DEMO mới." -ForegroundColor Green
Write-Host "======================================================================" -ForegroundColor Green
