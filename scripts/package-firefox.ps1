$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $PSScriptRoot
& (Join-Path $root "scripts\build-firefox.ps1")

$manifest = Get-Content -Raw -LiteralPath (Join-Path $root "manifest.firefox.json") | ConvertFrom-Json
$dist = Join-Path $root "dist"
$firefoxDist = Join-Path $dist "firefox"
$zip = Join-Path $dist ("chatpulse-firefox-{0}.zip" -f $manifest.version)

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

Compress-Extension -Source $firefoxDist -Destination $zip

Write-Host "Firefox package ready:" $zip
