Add-Type -AssemblyName System.Drawing

$src = [System.Drawing.Bitmap]::FromFile('C:\Users\tsoan\.gemini\antigravity-ide\brain\3e7f4b0a-f05b-499b-9d88-623b9209cdb4\.user_uploaded\media_1791020342673.jpg')
$w = $src.Width
$h = $src.Height

# Setup centerline
$x1 = 38.0; $y1 = 333.0; $x2 = 924.0; $y2 = 145.0
$dx = $x2 - $x1; $dy = $y2 - $y1; $len = [Math]::Sqrt($dx*$dx + $dy*$dy)
$ux = $dx / $len; $uy = $dy / $len
$nx = -$uy; $ny = $ux

# We create an exact mask bitmap
$mask = New-Object System.Drawing.Bitmap($w, $h, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)

# Background reference color map (smooth gradient from left (R=95, G=94, B=99) to right (R=135, G=133, B=138))
# For each dist along the line, find top boundary (where metal begins) and bottom boundary (where metal ends before floor shadow)
# Let's inspect along normal for each integer dist:
for ($dist = 0; $dist -le $len; $dist += 1.0) {
    $cx = $x1 + $ux * $dist
    $cy = $y1 + $uy * $dist
    
    # Radius profile:
    # Caps (0..40 and len-40..len): flared cap
    # Sleeves (360..550): thicker middle
    # Rest: ~ 23 px
    $topLimit = -26.0
    $botLimit = 22.0
    
    if ($dist -ge 360 -and $dist -le 550) {
        # Middle bulge
        $mFactor = 1.0 - [Math]::Pow(($dist - 455.0) / 95.0, 2)
        if ($mFactor -lt 0) { $mFactor = 0 }
        $topLimit = -26.0 - ($mFactor * 7.5)
        $botLimit = 22.0 + ($mFactor * 8.5)
    } elseif ($dist -lt 35) {
        # Left flare
        $f = (35 - $dist) / 35.0
        $topLimit = -26.0 - ($f * 5.0)
        $botLimit = 22.0 + ($f * 13.0)
    } elseif ($dist -gt ($len - 35)) {
        # Right flare
        $f = ($dist - ($len - 35)) / 35.0
        $topLimit = -26.0 - ($f * 4.0)
        $botLimit = 22.0 + ($f * 7.0)
    }
    
    # Fill vertical strip along the normal
    # Allow soft anti-aliased edge (feather 1.5 px)
    for ($s = $topLimit - 3.0; $s -le $botLimit + 3.0; $s += 0.5) {
        $px = [int]($cx + $nx * $s)
        $py = [int]($cy + $ny * $s)
        if ($px -ge 0 -and $px -lt $w -and $py -ge 0 -and $py -lt $h) {
            $alpha = 1.0
            if ($s -lt $topLimit) {
                $alpha = 1.0 - (($topLimit - $s) / 2.0)
            } elseif ($s -gt $botLimit) {
                $alpha = 1.0 - (($s - $botLimit) / 2.0)
            }
            if ($alpha -gt 0) {
                if ($alpha -gt 1.0) { $alpha = 1.0 }
                $currentPixel = $mask.GetPixel($px, $py)
                $existingAlpha = $currentPixel.A / 255.0
                $finalAlpha = [Math]::Max($existingAlpha, $alpha)
                $intA = [int]($finalAlpha * 255)
                $mask.SetPixel($px, $py, [System.Drawing.Color]::FromArgb($intA, 255, 255, 255))
            }
        }
    }
}

# Now combine source image with mask
$transparentImg = New-Object System.Drawing.Bitmap($w, $h, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
for ($y = 0; $y -lt $h; $y++) {
    for ($x = 0; $x -lt $w; $x++) {
        $mA = $mask.GetPixel($x, $y).A
        if ($mA -gt 0) {
            $srcP = $src.GetPixel($x, $y)
            $transparentImg.SetPixel($x, $y, [System.Drawing.Color]::FromArgb($mA, $srcP.R, $srcP.G, $srcP.B))
        }
    }
}

# Auto-crop transparent borders with 20px padding
$minX = $w; $maxX = 0; $minY = $h; $maxY = 0
for ($y = 0; $y -lt $h; $y++) {
    for ($x = 0; $x -lt $w; $x++) {
        if ($transparentImg.GetPixel($x, $y).A -gt 10) {
            if ($x -lt $minX) { $minX = $x }
            if ($x -gt $maxX) { $maxX = $x }
            if ($y -lt $minY) { $minY = $y }
            if ($y -gt $maxY) { $maxY = $y }
        }
    }
}

$pad = 16
$cropX = [Math]::Max(0, $minX - $pad)
$cropY = [Math]::Max(0, $minY - $pad)
$cropW = [Math]::Min($w - $cropX, ($maxX - $minX + 1) + ($pad * 2))
$cropH = [Math]::Min($h - $cropY, ($maxY - $minY + 1) + ($pad * 2))

$rect = New-Object System.Drawing.Rectangle($cropX, $cropY, $cropW, $cropH)
$finalCropped = $transparentImg.Clone($rect, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)

$outPath = "c:\Users\tsoan\OneDrive\Documents\GitHub\bakis\assets\images\product-full-tension-joints-trans.png"
$finalCropped.Save($outPath, [System.Drawing.Imaging.ImageFormat]::Png)

Write-Host "Successfully generated transparent PNG at $outPath ($cropW x $cropH)"

$finalCropped.Dispose()
$transparentImg.Dispose()
$mask.Dispose()
$src.Dispose()
