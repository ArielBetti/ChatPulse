$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $PSScriptRoot
$outDir = Join-Path $root "src\assets\icons"
New-Item -ItemType Directory -Path $outDir -Force | Out-Null

Add-Type -AssemblyName System.Drawing
Add-Type -AssemblyName System.Windows.Forms

function New-RoundedRectPath {
  param(
    [float] $X,
    [float] $Y,
    [float] $Width,
    [float] $Height,
    [float] $Radius
  )

  $path = New-Object System.Drawing.Drawing2D.GraphicsPath
  $diameter = $Radius * 2
  $path.AddArc($X, $Y, $diameter, $diameter, 180, 90)
  $path.AddArc($X + $Width - $diameter, $Y, $diameter, $diameter, 270, 90)
  $path.AddArc($X + $Width - $diameter, $Y + $Height - $diameter, $diameter, $diameter, 0, 90)
  $path.AddArc($X, $Y + $Height - $diameter, $diameter, $diameter, 90, 90)
  $path.CloseFigure()
  return $path
}

function Draw-Icon {
  param(
    [int] $Size
  )

  $scale = $Size / 128.0
  $bitmap = New-Object System.Drawing.Bitmap($Size, $Size)
  $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
  $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
  $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
  $graphics.Clear([System.Drawing.Color]::Transparent)
  $graphics.ScaleTransform($scale, $scale)

  $bg = New-RoundedRectPath 0 0 128 128 28
  $graphics.FillPath((New-Object System.Drawing.SolidBrush([System.Drawing.ColorTranslator]::FromHtml("#08090B"))), $bg)

  $surface = New-RoundedRectPath 8 8 112 112 24
  $graphics.FillPath((New-Object System.Drawing.SolidBrush([System.Drawing.ColorTranslator]::FromHtml("#15161F"))), $surface)
  $graphics.DrawPath((New-Object System.Drawing.Pen([System.Drawing.ColorTranslator]::FromHtml("#2C2D3C"), 2)), $surface)

  $bubble = New-RoundedRectPath 35 28 59 46 10
  $tail = New-Object System.Drawing.Drawing2D.GraphicsPath
  $tail.AddPolygon([System.Drawing.PointF[]] @(
    (New-Object System.Drawing.PointF(44, 70)),
    (New-Object System.Drawing.PointF(44, 88)),
    (New-Object System.Drawing.PointF(61, 74))
  ))

  $bubbleBrush = New-Object System.Drawing.SolidBrush([System.Drawing.ColorTranslator]::FromHtml("#1C1D2A"))
  $bubblePen = New-Object System.Drawing.Pen([System.Drawing.ColorTranslator]::FromHtml("#5E6AD2"), 4)
  $bubblePen.LineJoin = [System.Drawing.Drawing2D.LineJoin]::Round
  $graphics.FillPath($bubbleBrush, $tail)
  $graphics.FillPath($bubbleBrush, $bubble)
  $graphics.DrawPath($bubblePen, $tail)
  $graphics.DrawPath($bubblePen, $bubble)

  $pulsePen = New-Object System.Drawing.Pen([System.Drawing.ColorTranslator]::FromHtml("#F2C94C"), 5)
  $pulsePen.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
  $pulsePen.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
  $pulsePen.LineJoin = [System.Drawing.Drawing2D.LineJoin]::Round
  $graphics.DrawLines($pulsePen, [System.Drawing.PointF[]] @(
    (New-Object System.Drawing.PointF(48, 52)),
    (New-Object System.Drawing.PointF(63, 52)),
    (New-Object System.Drawing.PointF(69, 43)),
    (New-Object System.Drawing.PointF(76, 61)),
    (New-Object System.Drawing.PointF(82, 52)),
    (New-Object System.Drawing.PointF(90, 52))
  ))

  $dotBrush = New-Object System.Drawing.SolidBrush([System.Drawing.ColorTranslator]::FromHtml("#EEEFFC"))
  $graphics.FillEllipse($dotBrush, 45, 48, 8, 8)
  $graphics.FillEllipse($dotBrush, 86, 48, 8, 8)
  $graphics.DrawLine((New-Object System.Drawing.Pen([System.Drawing.ColorTranslator]::FromHtml("#2C2D3C"), 5)), 38, 98, 90, 98)

  $file = Join-Path $outDir "icon-$Size.png"
  $bitmap.Save($file, [System.Drawing.Imaging.ImageFormat]::Png)
  $graphics.Dispose()
  $bitmap.Dispose()
}

16, 32, 48, 128 | ForEach-Object { Draw-Icon $_ }
Write-Host "Icons generated:" $outDir
