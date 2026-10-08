Add-Type -AssemblyName System.Drawing

$srcDir = "C:\Users\tsoan\.gemini\antigravity-ide\brain\9e34c8d7-f139-4d58-9006-02a807b07f04\.user_uploaded"
$dstDir = "c:\Users\tsoan\OneDrive\Documents\GitHub\bakis\assets\images"

# -------------------------------------------------------------
# 1. Full Tension Joints Image
# -------------------------------------------------------------
$jointSrc = Join-Path $srcDir "media_1791301290506.jpg"
$jointDst1 = Join-Path $dstDir "product-full-tension-joints-modal.jpg"
$jointDst2 = Join-Path $dstDir "product-automatic-line-splices-range.jpg"
Copy-Item -Path $jointSrc -Destination $jointDst1 -Force
Copy-Item -Path $jointSrc -Destination $jointDst2 -Force
Write-Host "Full Tension Joints modal image copied to: $jointDst1 and $jointDst2"

# -------------------------------------------------------------
# 2. Surge Arrestor: Convert pure white background to transparent PNG
# -------------------------------------------------------------
$surgeSrc = Join-Path $srcDir "media_1791301476339.jpg"
$surgeJpgDst = Join-Path $dstDir "product-surge-arrestors.jpg"
Copy-Item -Path $surgeSrc -Destination $surgeJpgDst -Force

$bmpSurge = New-Object System.Drawing.Bitmap($surgeSrc)
$w = $bmpSurge.Width
$h = $bmpSurge.Height
$transSurge = New-Object System.Drawing.Bitmap($w, $h, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)

# Flood fill / tolerance transparency from borders
# Flood fill from (0,0) and borders to mark background
$visited = New-Object "bool[,]" $w, $h
$queue = New-Object System.Collections.Generic.Queue[System.Drawing.Point]

# Enqueue all boundary pixels that are white/near white
for ($x = 0; $x -lt $w; $x++) {
    $cTop = $bmpSurge.GetPixel($x, 0)
    if ($cTop.R -ge 245 -and $cTop.G -ge 245 -and $cTop.B -ge 245) {
        $queue.Enqueue((New-Object System.Drawing.Point($x, 0)))
        $visited[$x, 0] = $true
    }
    $cBot = $bmpSurge.GetPixel($x, $h - 1)
    if ($cBot.R -ge 245 -and $cBot.G -ge 245 -and $cBot.B -ge 245) {
        $queue.Enqueue((New-Object System.Drawing.Point($x, $h - 1)))
        $visited[$x, $h - 1] = $true
    }
}
for ($y = 0; $y -lt $h; $y++) {
    $cLeft = $bmpSurge.GetPixel(0, $y)
    if ($cLeft.R -ge 245 -and $cLeft.G -ge 245 -and $cLeft.B -ge 245) {
        if (-not $visited[0, $y]) {
            $queue.Enqueue((New-Object System.Drawing.Point(0, $y)))
            $visited[0, $y] = $true
        }
    }
    $cRight = $bmpSurge.GetPixel($w - 1, $y)
    if ($cRight.R -ge 245 -and $cRight.G -ge 245 -and $cRight.B -ge 245) {
        if (-not $visited[$w - 1, $y]) {
            $queue.Enqueue((New-Object System.Drawing.Point($w - 1, $y)))
            $visited[$w - 1, $y] = $true
        }
    }
}

# Flood fill
while ($queue.Count -gt 0) {
    $pt = $queue.Dequeue()
    $px = $pt.X
    $py = $pt.Y
    
    $neighbors = @(
        (New-Object System.Drawing.Point($px + 1, $py)),
        (New-Object System.Drawing.Point($px - 1, $py)),
        (New-Object System.Drawing.Point($px, $py + 1)),
        (New-Object System.Drawing.Point($px, $py - 1))
    )
    foreach ($nb in $neighbors) {
        $nx = $nb.X
        $ny = $nb.Y
        if ($nx -ge 0 -and $nx -lt $w -and $ny -ge 0 -and $ny -lt $h) {
            if (-not $visited[$nx, $ny]) {
                $nc = $bmpSurge.GetPixel($nx, $ny)
                if ($nc.R -ge 240 -and $nc.G -ge 240 -and $nc.B -ge 240) {
                    $visited[$nx, $ny] = $true
                    $queue.Enqueue($nb)
                }
            }
        }
    }
}

# Create transparent image with smooth edge anti-aliasing
for ($y = 0; $y -lt $h; $y++) {
    for ($x = 0; $x -lt $w; $x++) {
        if ($visited[$x, $y]) {
            $transSurge.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(0, 0, 0, 0))
        } else {
            $orig = $bmpSurge.GetPixel($x, $y)
            # Edge feathering for near-white pixels adjacent to background
            if ($orig.R -ge 235 -and $orig.G -ge 235 -and $orig.B -ge 235) {
                # Check distance to background
                $brightness = ($orig.R + $orig.G + $orig.B) / 3.0
                $alpha = [int]([Math]::Max(0.0, [Math]::Min(255.0, (255.0 - $brightness) * 12.0)))
                if ($alpha -eq 0) {
                    $transSurge.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(0, 0, 0, 0))
                } else {
                    $transSurge.SetPixel($x, $y, [System.Drawing.Color]::FromArgb($alpha, $orig.R, $orig.G, $orig.B))
                }
            } else {
                $transSurge.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(255, $orig.R, $orig.G, $orig.B))
            }
        }
    }
}

$surgeTransPngDst = Join-Path $dstDir "product-surge-arrestors-trans.png"
$surgePngDst = Join-Path $dstDir "product-surge-arrestors.png"
$transSurge.Save($surgeTransPngDst, [System.Drawing.Imaging.ImageFormat]::Png)
$transSurge.Save($surgePngDst, [System.Drawing.Imaging.ImageFormat]::Png)
Write-Host "Surge Arrestor transparent PNG saved to: $surgeTransPngDst"
$bmpSurge.Dispose()
$transSurge.Dispose()

# -------------------------------------------------------------
# 3. Substation Equipment Clamp: Convert white background to transparent PNG
# -------------------------------------------------------------
$clampSrc = Join-Path $srcDir "media_1791301635898.jpg"
$clampJpgDst = Join-Path $dstDir "product-substation-clamp.jpg"
Copy-Item -Path $clampSrc -Destination $clampJpgDst -Force

$bmpClamp = New-Object System.Drawing.Bitmap($clampSrc)
$cw = $bmpClamp.Width
$ch = $bmpClamp.Height
$transClamp = New-Object System.Drawing.Bitmap($cw, $ch, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)

$cVisited = New-Object "bool[,]" $cw, $ch
$cQueue = New-Object System.Collections.Generic.Queue[System.Drawing.Point]

for ($x = 0; $x -lt $cw; $x++) {
    $cTop = $bmpClamp.GetPixel($x, 0)
    if ($cTop.R -ge 240 -and $cTop.G -ge 240 -and $cTop.B -ge 240) {
        $cQueue.Enqueue((New-Object System.Drawing.Point($x, 0)))
        $cVisited[$x, 0] = $true
    }
    $cBot = $bmpClamp.GetPixel($x, $ch - 1)
    if ($cBot.R -ge 240 -and $cBot.G -ge 240 -and $cBot.B -ge 240) {
        $cQueue.Enqueue((New-Object System.Drawing.Point($x, $ch - 1)))
        $cVisited[$x, $ch - 1] = $true
    }
}
for ($y = 0; $y -lt $ch; $y++) {
    $cLeft = $bmpClamp.GetPixel(0, $y)
    if ($cLeft.R -ge 240 -and $cLeft.G -ge 240 -and $cLeft.B -ge 240) {
        if (-not $cVisited[0, $y]) {
            $cQueue.Enqueue((New-Object System.Drawing.Point(0, $y)))
            $cVisited[0, $y] = $true
        }
    }
    $cRight = $bmpClamp.GetPixel($cw - 1, $y)
    if ($cRight.R -ge 240 -and $cRight.G -ge 240 -and $cRight.B -ge 240) {
        if (-not $cVisited[$cw - 1, $y]) {
            $cQueue.Enqueue((New-Object System.Drawing.Point($cw - 1, $y)))
            $cVisited[$cw - 1, $y] = $true
        }
    }
}

while ($cQueue.Count -gt 0) {
    $pt = $cQueue.Dequeue()
    $px = $pt.X
    $py = $pt.Y
    
    $neighbors = @(
        (New-Object System.Drawing.Point($px + 1, $py)),
        (New-Object System.Drawing.Point($px - 1, $py)),
        (New-Object System.Drawing.Point($px, $py + 1)),
        (New-Object System.Drawing.Point($px, $py - 1))
    )
    foreach ($nb in $neighbors) {
        $nx = $nb.X
        $ny = $nb.Y
        if ($nx -ge 0 -and $nx -lt $cw -and $ny -ge 0 -and $ny -lt $ch) {
            if (-not $cVisited[$nx, $ny]) {
                $nc = $bmpClamp.GetPixel($nx, $ny)
                if ($nc.R -ge 235 -and $nc.G -ge 235 -and $nc.B -ge 235) {
                    $cVisited[$nx, $ny] = $true
                    $cQueue.Enqueue($nb)
                }
            }
        }
    }
}

for ($y = 0; $y -lt $ch; $y++) {
    for ($x = 0; $x -lt $cw; $x++) {
        if ($cVisited[$x, $y]) {
            $transClamp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(0, 0, 0, 0))
        } else {
            $orig = $bmpClamp.GetPixel($x, $y)
            if ($orig.R -ge 235 -and $orig.G -ge 235 -and $orig.B -ge 235) {
                $brightness = ($orig.R + $orig.G + $orig.B) / 3.0
                $alpha = [int]([Math]::Max(0.0, [Math]::Min(255.0, (255.0 - $brightness) * 12.0)))
                if ($alpha -eq 0) {
                    $transClamp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(0, 0, 0, 0))
                } else {
                    $transClamp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb($alpha, $orig.R, $orig.G, $orig.B))
                }
            } else {
                $transClamp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(255, $orig.R, $orig.G, $orig.B))
            }
        }
    }
}

$clampTransPngDst = Join-Path $dstDir "product-substation-clamp.png"
$transClamp.Save($clampTransPngDst, [System.Drawing.Imaging.ImageFormat]::Png)
Write-Host "Substation Clamp transparent PNG saved to: $clampTransPngDst"
$bmpClamp.Dispose()
$transClamp.Dispose()

Write-Host "All image processing completed successfully!"
