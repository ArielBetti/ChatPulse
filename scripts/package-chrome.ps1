$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $PSScriptRoot
$manifest = Get-Content -Raw -LiteralPath (Join-Path $root "manifest.json") | ConvertFrom-Json
$dist = Join-Path $root "dist"
$temp = Join-Path $dist "chrome-package"
$zip = Join-Path $dist ("chatpulse-chrome-{0}.zip" -f $manifest.version)

function Compress-Extension {
  param(
    [string] $Source,
    [string] $Destination
  )

  Add-Type -AssemblyName System.IO.Compression
  Add-Type -AssemblyName System.IO.Compression.FileSystem

  if (Test-Path -LiteralPath $Destination) {
    Remove-Item -LiteralPath $Destination -Force
  }

  $archive = [System.IO.Compression.ZipFile]::Open($Destination, [System.IO.Compression.ZipArchiveMode]::Create)
  try {
    $sourceFull = (Resolve-Path -LiteralPath $Source).Path.TrimEnd("\", "/")
    Get-ChildItem -LiteralPath $Source -Recurse -File | ForEach-Object {
      $fileFull = (Resolve-Path -LiteralPath $_.FullName).Path
      $relative = $fileFull.Substring($sourceFull.Length + 1).Replace("\", "/")
      [System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile($archive, $_.FullName, $relative, [System.IO.Compression.CompressionLevel]::Optimal) | Out-Null
    }
  } finally {
    $archive.Dispose()
  }
}

if (Test-Path -LiteralPath $temp) {
  Remove-Item -LiteralPath $temp -Recurse -Force
}

New-Item -ItemType Directory -Path $temp -Force | Out-Null
Copy-Item -LiteralPath (Join-Path $root "manifest.json") -Destination $temp
Copy-Item -LiteralPath (Join-Path $root "README.md") -Destination $temp
Copy-Item -LiteralPath (Join-Path $root "src") -Destination $temp -Recurse

Compress-Extension -Source $temp -Destination $zip
Remove-Item -LiteralPath $temp -Recurse -Force

Write-Host "Chrome package ready:" $zip
