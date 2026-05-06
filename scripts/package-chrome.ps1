$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $PSScriptRoot
$manifest = Get-Content -Raw -LiteralPath (Join-Path $root "manifest.json") | ConvertFrom-Json
$dist = Join-Path $root "dist"
$temp = Join-Path $dist "chrome-package"
$zip = Join-Path $dist ("chatpulse-chrome-{0}.zip" -f $manifest.version)

if (Test-Path -LiteralPath $temp) {
  Remove-Item -LiteralPath $temp -Recurse -Force
}

New-Item -ItemType Directory -Path $temp -Force | Out-Null
Copy-Item -LiteralPath (Join-Path $root "manifest.json") -Destination $temp
Copy-Item -LiteralPath (Join-Path $root "README.md") -Destination $temp
Copy-Item -LiteralPath (Join-Path $root "src") -Destination $temp -Recurse

if (Test-Path -LiteralPath $zip) {
  Remove-Item -LiteralPath $zip -Force
}

Compress-Archive -Path (Join-Path $temp "*") -DestinationPath $zip -Force
Remove-Item -LiteralPath $temp -Recurse -Force

Write-Host "Chrome package ready:" $zip
