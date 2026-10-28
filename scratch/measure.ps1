Add-Type -AssemblyName System.Drawing
$bmp = New-Object System.Drawing.Bitmap('model email text email signature\WhatsApp Image 2026-10-27 at 3.59.34 PM (1).jpeg')
Write-Host "Image Size: $($bmp.Width) x $($bmp.Height)"

# 1. Divider 1 (between logo and employee details)
$divider1X = 0
for ($x = 200; $x -lt 400; $x++) {
    $c = $bmp.GetPixel($x, 267)
    if ($c.R -gt 180 -and $c.R -lt 230 -and $c.B -gt 220) {
        $divider1X = $x
        Write-Host "Divider 1 at X=$x (RGB: $($c.R),$($c.G),$($c.B))"
    }
}

# 2. Logo bounds
$lMinX = 9999; $lMaxX = 0; $lMinY = 9999; $lMaxY = 0;
for ($y = 20; $y -lt ($bmp.Height - 20); $y++) {
    for ($x = 10; $x -lt 340; $x++) {
        $c = $bmp.GetPixel($x, $y)
        if ($c.R -lt 220 -or $c.G -lt 220 -or $c.B -lt 220) {
            if ($x -lt $lMinX) { $lMinX = $x }
            if ($x -gt $lMaxX) { $lMaxX = $x }
            if ($y -lt $lMinY) { $lMinY = $y }
            if ($y -gt $lMaxY) { $lMaxY = $y }
        }
    }
}
Write-Host "Logo bounds: minX=$lMinX, maxX=$lMaxX, minY=$lMinY, maxY=$lMaxY (Width=$($lMaxX - $lMinX + 1), Height=$($lMaxY - $lMinY + 1))"

# Check vertical gap between mark and text in logo
$gapY = 0
for ($y = $lMinY; $y -le $lMaxY; $y++) {
    $dark = 0
    for ($x = $lMinX; $x -le $lMaxX; $x++) {
        $c = $bmp.GetPixel($x, $y)
        if ($c.R -lt 220 -or $c.G -lt 220 -or $c.B -lt 220) { $dark++ }
    }
    if ($dark -eq 0) {
        Write-Host "Gap inside logo at Y=$y"
    }
}

# 3. Employee details region (X from divider1 to map)
# Find where world map starts
$mapMinX = 9999; $mapMaxX = 0; $mapMinY = 9999; $mapMaxY = 0;
for ($y = 50; $y -lt 350; $y++) {
    for ($x = 850; $x -lt 1300; $x++) {
        $c = $bmp.GetPixel($x, $y)
        if ($c.R -lt 240 -and $c.B -gt 200 -and $c.R -ne $c.B) {
            if ($x -lt $mapMinX) { $mapMinX = $x }
            if ($x -gt $mapMaxX) { $mapMaxX = $x }
            if ($y -lt $mapMinY) { $mapMinY = $y }
            if ($y -gt $mapMaxY) { $mapMaxY = $y }
        }
    }
}
Write-Host "World Map bounds: minX=$mapMinX, maxX=$mapMaxX, minY=$mapMinY, maxY=$mapMaxY (Width=$($mapMaxX - $mapMinX + 1), Height=$($mapMaxY - $mapMinY + 1))"

# 4. Badges bounds (bottom-right)
$bMinX = 9999; $bMaxX = 0; $bMinY = 9999; $bMaxY = 0;
for ($y = 350; $y -lt ($bmp.Height - 10); $y++) {
    for ($x = 1100; $x -lt ($bmp.Width - 10); $x++) {
        $c = $bmp.GetPixel($x, $y)
        if ($c.R -lt 230 -or $c.G -lt 230 -or $c.B -lt 230) {
            if ($x -lt $bMinX) { $bMinX = $x }
            if ($x -gt $bMaxX) { $bMaxX = $x }
            if ($y -lt $bMinY) { $bMinY = $y }
            if ($y -gt $bMaxY) { $bMaxY = $y }
        }
    }
}
Write-Host "Accreditation badges bounds: minX=$bMinX, maxX=$bMaxX, minY=$bMinY, maxY=$bMaxY (Width=$($bMaxX - $bMinX + 1), Height=$($bMaxY - $bMinY + 1))"

# 5. Measure "GLOBAL FREIGHT. SMART LOGISTICS."
$tMinX = 9999; $tMaxX = 0; $tMinY = 9999; $tMaxY = 0;
for ($y = 150; $y -lt 300; $y++) {
    for ($x = 1250; $x -lt ($bmp.Width - 10); $x++) {
        $c = $bmp.GetPixel($x, $y)
        if ($c.R -lt 150 -and $c.B -gt 100) {
            if ($x -lt $tMinX) { $tMinX = $x }
            if ($x -gt $tMaxX) { $tMaxX = $x }
            if ($y -lt $tMinY) { $tMinY = $y }
            if ($y -gt $tMaxY) { $tMaxY = $y }
        }
    }
}
Write-Host "Text 'GLOBAL FREIGHT': minX=$tMinX, maxX=$tMaxX, minY=$tMinY, maxY=$tMaxY (Width=$($tMaxX - $tMinX + 1), Height=$($tMaxY - $tMinY + 1))"

$bmp.Dispose()
