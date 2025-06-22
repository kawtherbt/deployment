# Define API URL
$url = "http://localhost:8000/api/v1/connections/sync"

# Credentials (your Airbyte username and password)
$username = "kawtherbenticha1@gmail.com"
$password = "password"

# Encode username:password in base64 for Basic Auth header
$pair = "${username}:${password}"
$base64AuthInfo = [Convert]::ToBase64String([Text.Encoding]::ASCII.GetBytes($pair))

# Create headers with Authorization
$headers = @{
    Authorization = "Basic $base64AuthInfo"
}

# JSON payload to trigger sync with your connection ID
$body = @{
    connectionId = "7358320b-35a5-472c-979f-e134f073206b"
}

$jsonBody = $body | ConvertTo-Json -Depth 10

try {
    $response = Invoke-RestMethod -Uri $url -Method Post -Headers $headers -Body $jsonBody -ContentType "application/json"
    Write-Host "✅ Sync triggered successfully."
    $response
} catch {
    Write-Host "❌ Error triggering sync: $($_.Exception.Message)"
    if ($_.Exception.Response -ne $null) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $reader.BaseStream.Position = 0
        $reader.DiscardBufferedData()
        $responseBody = $reader.ReadToEnd()
        Write-Host "API Response: $responseBody"
    }
}
                