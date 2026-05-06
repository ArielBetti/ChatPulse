$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $PSScriptRoot
$dist = Join-Path $root "dist\firefox"
$srcDist = Join-Path $dist "src"

if (Test-Path -LiteralPath $dist) {
  Remove-Item -LiteralPath $dist -Recurse -Force
}

New-Item -ItemType Directory -Path $srcDist -Force | Out-Null
Copy-Item -LiteralPath (Join-Path $root "manifest.firefox.json") -Destination (Join-Path $dist "manifest.json")
Copy-Item -LiteralPath (Join-Path $root "README.md") -Destination (Join-Path $dist "README.md")
Copy-Item -LiteralPath (Join-Path $root "src\background.js") -Destination $srcDist
Copy-Item -LiteralPath (Join-Path $root "src\content.js") -Destination $srcDist
Copy-Item -LiteralPath (Join-Path $root "src\popup.css") -Destination $srcDist
Copy-Item -LiteralPath (Join-Path $root "src\popup.html") -Destination $srcDist
Copy-Item -LiteralPath (Join-Path $root "src\popup.js") -Destination $srcDist
Copy-Item -LiteralPath (Join-Path $root "src\assets") -Destination $srcDist -Recurse

Write-Host "Firefox build ready:" $dist
