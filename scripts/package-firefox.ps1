$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $PSScriptRoot
& (Join-Path $root "scripts\build-firefox.ps1")

$manifest = Get-Content -Raw -LiteralPath (Join-Path $root "manifest.firefox.json") | ConvertFrom-Json
$dist = Join-Path $root "dist"
$firefoxDist = Join-Path $dist "firefox"
$zip = Join-Path $dist ("chatpulse-firefox-{0}.zip" -f $manifest.version)

if (Test-Path -LiteralPath $zip) {
  Remove-Item -LiteralPath $zip -Force
}

Compress-Archive -Path (Join-Path $firefoxDist "*") -DestinationPath $zip -Force

Write-Host "Firefox package ready:" $zip
