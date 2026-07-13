# Matin Pakfetrat - D2 Test Cases (TC-D2-M1 through TC-D2-M4)
#
# HOW TO RUN (Windows):
#   1. Open PowerShell.
#   2. cd to this folder if you aren't already in it.
#   3. Run:  powershell -ExecutionPolicy Bypass -File matin-testcases.ps1
#
# Requires the Spring Boot application to be running on localhost:8080
#
# NOTE: JSON bodies are written to C:\d2test\body.json and sent via curl's
# "-d @file" syntax instead of as inline command-line text. Passing a JSON
# string directly as a PowerShell argument to a native exe like curl.exe is
# unreliable on Windows because PowerShell has to re-quote the whole argument
# for the OS process layer, and it does not reliably preserve embedded double
# quotes. Reading the body from a file avoids that entirely.

$BaseUrl = "http://localhost:8080"
$TempDir = "C:\d2test"
New-Item -ItemType Directory -Path $TempDir -Force | Out-Null
$TempBody = Join-Path $TempDir "body.json"

function Send-JsonPost($url, $jsonText) {
    Set-Content -Path $TempBody -Value $jsonText -Encoding ASCII -NoNewline
    curl.exe -s -X POST $url -H "Content-Type: application/json" -d "@$TempBody"
}

Write-Host "============================================="
Write-Host "TC-D2-M1: Successful test drive booking"
Write-Host "Expected: 201 Created with booking object"
Write-Host "============================================="
$json1 = (@{ userId = 1; vehicleId = 1; bookingDateTime = "2026-07-20T09:00:00" } | ConvertTo-Json -Compress)
Write-Host (Send-JsonPost "$BaseUrl/api/test-drives/book" $json1)
Write-Host ""

Write-Host "============================================="
Write-Host "TC-D2-M2: Test drive availability conflict rejected"
Write-Host "Expected: 409 Conflict with error message"
Write-Host "(Booking the same vehicle/time slot as TC-D2-M1)"
Write-Host "============================================="
$json2 = (@{ userId = 2; vehicleId = 1; bookingDateTime = "2026-07-20T09:00:00" } | ConvertTo-Json -Compress)
Write-Host (Send-JsonPost "$BaseUrl/api/test-drives/book" $json2)
Write-Host ""

Write-Host "============================================="
Write-Host "Seeding visit events so the usage report has data"
Write-Host "============================================="
$eventView = (@{ ipAddress = "1.2.3.4"; vehicleId = 1; eventType = "VIEW" } | ConvertTo-Json -Compress)
$eventCart = (@{ ipAddress = "1.2.3.4"; vehicleId = 1; eventType = "CART" } | ConvertTo-Json -Compress)
$eventPurchase = (@{ ipAddress = "1.2.3.4"; vehicleId = 1; eventType = "PURCHASE" } | ConvertTo-Json -Compress)
Send-JsonPost "$BaseUrl/api/admin/events" $eventView | Out-Null
Send-JsonPost "$BaseUrl/api/admin/events" $eventCart | Out-Null
Send-JsonPost "$BaseUrl/api/admin/events" $eventPurchase | Out-Null
Write-Host "Done."
Write-Host ""

Write-Host "============================================="
Write-Host "Seeding a CONFIRMED order so the sales report has data"
Write-Host "(Assumes vehicleId 1 exists)"
Write-Host "============================================="
$cartJson = (@{ userId = 1; vehicleId = 1; quantity = 1; unitPrice = 45000 } | ConvertTo-Json -Compress)
$checkoutJson = (@{ userId = 1 } | ConvertTo-Json -Compress)
Send-JsonPost "$BaseUrl/api/cart/add" $cartJson | Out-Null
Write-Host (Send-JsonPost "$BaseUrl/api/orders/checkout" $checkoutJson)
Write-Host ""

Write-Host "============================================="
Write-Host "TC-D2-M3: Admin sales report generated"
Write-Host "Expected: 200 OK with JSON array of confirmed-order counts by month"
Write-Host "============================================="
Write-Host (curl.exe -s -X GET "$BaseUrl/api/admin/reports/sales")
Write-Host ""

Write-Host "============================================="
Write-Host "TC-D2-M4: Admin usage report generated"
Write-Host "Expected: 200 OK with VIEW/CART/PURCHASE counts"
Write-Host "============================================="
Write-Host (curl.exe -s -X GET "$BaseUrl/api/admin/reports/usage")
Write-Host ""
