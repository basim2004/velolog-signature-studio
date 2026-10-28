Add-Type -AssemblyName System.Drawing

$srcPath = "C:\Users\hp\.gemini\antigravity\brain\683cfc52-d750-464c-ab8d-3ffa17f257a4\.user_uploaded\media_1793182361158_2cf70003.jpg"

if (-not (Test-Path "icons")) {
    New-Item -ItemType Directory -Path "icons" | Out-Null
}

Copy-Item -Path $srcPath -Destination "icons\app-icon.jpg" -Force

$srcImg = [System.Drawing.Image]::FromFile($srcPath)
Write-Host "Source Image loaded: $($srcImg.Width) x $($srcImg.Height)"

function Resize-And-Save($targetPath, $targetWidth, $targetHeight) {
    $bmp = New-Object System.Drawing.Bitmap($targetWidth, $targetHeight, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $graphics = [System.Drawing.Graphics]::FromImage($bmp)
    $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $graphics.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
    $graphics.Clear([System.Drawing.Color]::Transparent)

    $rect = New-Object System.Drawing.Rectangle(0, 0, $targetWidth, $targetHeight)
    $graphics.DrawImage($srcImg, $rect)

    $bmp.Save($targetPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $graphics.Dispose()
    $bmp.Dispose()
    Write-Host "Generated: $targetPath ($($targetWidth)x$($targetHeight))"
}

# Standard icons
Resize-And-Save "icons\icon-192.png" 192 192
Resize-And-Save "icons\icon-512.png" 512 512
Resize-And-Save "icons\apple-touch-icon.png" 180 180
Resize-And-Save "icons\favicon.png" 64 64
Resize-And-Save "icons\icon-maskable-192.png" 192 192
Resize-And-Save "icons\icon-maskable-512.png" 512 512

# Copy favicon to root
Copy-Item -Path "icons\favicon.png" -Destination "favicon.png" -Force

$srcImg.Dispose()
Write-Host "All icons generated successfully!"
