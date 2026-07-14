# Tazwar Sikder - D2 Test Cases (TC-05, TC-06, TC-11, TC-CART-04)
#
# HOW TO RUN (Windows):
#   1. Open PowerShell.
#   2. cd to this folder if you aren't already in it.
#   3. Run:  powershell -ExecutionPolicy Bypass -File tazwar-testcases.ps1
#
# Requires the Spring Boot application to be running on localhost:8080
# Assumes vehicleId 1 and vehicleId 2 already exist in the catalogue
# (seeded by Minh Anh's Vehicle data / data.sql).
#
# NOTE: JSON bodies are written to a temp file and sent via curl's "-d @file"
# syntax rather than as inline command-line text, for the same reason noted
# in Matin's script: PowerShell re-quoting of embedded double quotes for a
# native exe like curl.exe is unreliable on Windows.

$BaseUrl = "http://localhost:8080"
$TempDir = "C:\d2test"
New-Item -ItemType Directory -Path $TempDir -Force | Out-Null
$TempBody = Join-Path $TempDir "body.json"

function Send-JsonPost($url, $jsonText) {
    Set-Content -Path $TempBody -Value $jsonText -Encoding ASCII -NoNewline
    curl.exe -s -X POST $url -H "Content-Type: application/json" -d "@$TempBody"
}

function Send-Delete($url) {
    curl.exe -s -X DELETE $url
}

Write-Host "============================================="
Write-Host "TC-05: Shopping Cart Management (add / get / remove)"
Write-Host "Expected: item created with server-resolved price; GET returns it; DELETE removes it; GET after is empty"
Write-Host "============================================="
$addJson = (@{ userId = 501; vehicleId = 1; quantity = 1 } | ConvertTo-Json -Compress)
$addResult = Send-JsonPost "$BaseUrl/api/cart/add" $addJson
Write-Host "Add result: $addResult"
$cartItemId = ($addResult | ConvertFrom-Json).id

Write-Host "Cart after add:"
Write-Host (curl.exe -s -X GET "$BaseUrl/api/cart/501")

Write-Host "Removing cart item $cartItemId..."
Send-Delete "$BaseUrl/api/cart/remove/$cartItemId" | Out-Null

Write-Host "Cart after remove (expect empty array):"
Write-Host (curl.exe -s -X GET "$BaseUrl/api/cart/501")
Write-Host ""

Write-Host "============================================="
Write-Host "TC-06: Checkout and Order Placement"
Write-Host "Expected: order created and CONFIRMED on first attempt; cart cleared"
Write-Host "============================================="
$cart1 = (@{ userId = 502; vehicleId = 1; quantity = 1 } | ConvertTo-Json -Compress)
Send-JsonPost "$BaseUrl/api/cart/add" $cart1 | Out-Null
$checkout1 = (@{ userId = 502 } | ConvertTo-Json -Compress)
Write-Host (Send-JsonPost "$BaseUrl/api/orders/checkout" $checkout1)
Write-Host ""

Write-Host "============================================="
Write-Host "TC-11: Payment Authorization Failure (3rd consecutive attempt denied)"
Write-Host "Expected: attempts 1 and 2 CONFIRMED, attempt 3 DENIED"
Write-Host "(Uses a fresh userId so the payments-table attempt count starts at 0)"
Write-Host "============================================="
$payUser = 503

Write-Host "Attempt 1 (expect CONFIRMED):"
Send-JsonPost "$BaseUrl/api/cart/add" (@{ userId = $payUser; vehicleId = 1; quantity = 1 } | ConvertTo-Json -Compress) | Out-Null
Write-Host (Send-JsonPost "$BaseUrl/api/orders/checkout" (@{ userId = $payUser } | ConvertTo-Json -Compress))
Write-Host ""

Write-Host "Attempt 2 (expect CONFIRMED):"
Send-JsonPost "$BaseUrl/api/cart/add" (@{ userId = $payUser; vehicleId = 1; quantity = 1 } | ConvertTo-Json -Compress) | Out-Null
Write-Host (Send-JsonPost "$BaseUrl/api/orders/checkout" (@{ userId = $payUser } | ConvertTo-Json -Compress))
Write-Host ""

Write-Host "Attempt 3 (expect DENIED, cart NOT cleared):"
Send-JsonPost "$BaseUrl/api/cart/add" (@{ userId = $payUser; vehicleId = 1; quantity = 1 } | ConvertTo-Json -Compress) | Out-Null
Write-Host (Send-JsonPost "$BaseUrl/api/orders/checkout" (@{ userId = $payUser } | ConvertTo-Json -Compress))
Write-Host ""

Write-Host "Cart after denied attempt (expect the item still present, since denial does not clear the cart):"
Write-Host (curl.exe -s -X GET "$BaseUrl/api/cart/$payUser")
Write-Host ""

Write-Host "============================================="
Write-Host "TC-CART-04: Cart Total Calculation"
Write-Host "Expected: order totalAmount equals sum of (unitPrice x quantity) across both vehicles"
Write-Host "(Verified indirectly via the checkout response's totalAmount field,"
Write-Host " since calculateCartTotal() is not exposed as its own endpoint.)"
Write-Host "============================================="
$totalUser = 504
Send-JsonPost "$BaseUrl/api/cart/add" (@{ userId = $totalUser; vehicleId = 1; quantity = 2 } | ConvertTo-Json -Compress) | Out-Null
Send-JsonPost "$BaseUrl/api/cart/add" (@{ userId = $totalUser; vehicleId = 2; quantity = 1 } | ConvertTo-Json -Compress) | Out-Null

Write-Host "Cart before checkout (2x vehicle 1, 1x vehicle 2):"
Write-Host (curl.exe -s -X GET "$BaseUrl/api/cart/$totalUser")

Write-Host "Checkout result (check totalAmount matches manual calculation):"
Write-Host (Send-JsonPost "$BaseUrl/api/orders/checkout" (@{ userId = $totalUser } | ConvertTo-Json -Compress))
Write-Host ""