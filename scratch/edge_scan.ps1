Add-Type -AssemblyName System.Drawing

$src = [System.Drawing.Bitmap]::FromFile('C:\Users\tsoan\.gemini\antigravity-ide\brain\3e7f4b0a-f05b-499b-9d88-623b9209cdb4\.user_uploaded\media_1791020342673.jpg')
$w = $src.Width
$h = $src.Height

# Start and end of the centerline
$x1 = 38.0
$y1 = 333.0
$x2 = 924.0
$y2 = 145.0

$dx = $x2 - $x1
$dy = $y2 - $y1
$len = [Math]::Sqrt($dx*$dx + $dy*$dy)
$ux = $dx / $len
$uy = $dy / $len
$nx = -$uy
$ny = $ux

# We will measure the actual edge by checking color gradients / brightness jumps
# Top side (+n or -n):
# Since ny is positive (~0.978), moving in +n increases Y (moves DOWN on screen).
# Moving in -n decreases Y (moves UP on screen).
# UP side is the upper metal edge. DOWN side is the bottom metal edge (where shadow starts).

$polyTop = New-Object System.Collections.Generic.List[System.Drawing.PointF]
$polyBottom = New-Object System.Collections.Generic.List[System.Drawing.PointF]

for ($dist = 0; $dist -le $len; $dist += 2.0) {
    $cx = $x1 + $ux * $dist
    $cy = $y1 + $uy * $dist
    
    # Expected radius based on profile
    # Center section is roughly between 360 and 550
    $expR = 25.0
    if ($dist -ge 370 -and $dist -le 540) {
        $expR = 36.0
    } elseif ($dist -lt 30) {
        $expR = 27.0 + (30 - $dist) * 0.35
    } elseif ($dist -gt ($len - 30)) {
        $expR = 27.0 + ($dist - ($len - 30)) * 0.35
    }
    
    # Find upper boundary (moving in -n direction)
    $rUp = $expR
    for ($s = $expR - 10; $s -le $expR + 15; $s += 0.5) {
        $px = [int]($cx - $nx * $s)
        $py = [int]($cy - $ny * $s)
        if ($px -ge 0 -and $px -lt $w -and $py -ge 0 -and $py -lt $h) {
            $p = $src.GetPixel($px, $py)
            $lum = ($p.R * 0.299 + $p.G * 0.587 + $p.B * 0.114)
            # The background above has luminosity around 100-130
            # Just above the top edge, the floor is grey. The edge of the tube has a sharp highlight or specular glint (lum > 180 or sharp gradient)
        }
    }
}
$src.Dispose()
Write-Host "Edge scan prepared."
