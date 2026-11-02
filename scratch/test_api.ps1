$backendUrl = "http://localhost:8088"
$login = Invoke-RestMethod -Uri "$backendUrl/api/auth/login" -Method Post -Body (@{ username = "admin"; password = "admin123" } | ConvertTo-Json) -ContentType "application/json"
$token = $login.data.token
$headers = @{ "Authorization" = "Bearer $token" }

Write-Host "--- TEST 01 ---"
try {
    $res1 = Invoke-RestMethod -Uri "$backendUrl/api/demo-lab/run-test/TEST_01_RESOURCEQUOTA" -Method Post -Headers $headers
    Write-Host "TEST 01 SUCCESS:" ($res1.data | ConvertTo-Json -Depth 3)
} catch {
    Write-Host "TEST 01 FAILED:" $_.Exception.Message
    if ($_.Exception.Response) {
        $stream = $_.Exception.Response.GetResponseStream()
        $reader = New-Object System.IO.StreamReader($stream)
        Write-Host "Response Body:" $reader.ReadToEnd()
    }
}

Write-Host "`n--- TEST 02 ---"
try {
    $res2 = Invoke-RestMethod -Uri "$backendUrl/api/demo-lab/run-test/TEST_02_RBAC" -Method Post -Headers $headers
    Write-Host "TEST 02 SUCCESS:" ($res2.data | ConvertTo-Json -Depth 3)
} catch {
    Write-Host "TEST 02 FAILED:" $_.Exception.Message
}
