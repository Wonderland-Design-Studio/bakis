Add-Type -AssemblyName System.Drawing

$srcPath = "c:\Users\tsoan\OneDrive\Documents\GitHub\bakis\assets\images\bakis-logo-new.jpg"
$outPng = "c:\Users\tsoan\OneDrive\Documents\GitHub\bakis\assets\images\bakis-logo-transparent.png"
$outTrimmedJpg = "c:\Users\tsoan\OneDrive\Documents\GitHub\bakis\assets\images\bakis-logo-new-trimmed.jpg"

$bmp = [System.Drawing.Bitmap]::FromFile($srcPath)
Write-Host "Original dimensions: $($bmp.Width) x $($bmp.Height)"

# Sample background color near corners
# Background is dark green (#11261d approx)
$samples = @()
for ($x = 0; $x -lt 20; $x++) {
    for ($y = 0; $y -lt 20; $y++) {
        $samples += $bmp.GetPixel($x, $y)
    }
}
$avgR = ($samples | Measure-Object -Property R -Average).Average
$avgG = ($samples | Measure-Object -Property G -Average).Average
$avgB = ($samples | Measure-Object -Property B -Average).Average

Write-Host "Average BG Color: R=$avgR, G=$avgG, B=$avgB"

# Let's inspect pixel colors across rows/columns to find bounding box of non-background content
$minX = $bmp.Width
$minY = $bmp.Height
$maxX = 0
$maxY = 0

for ($y = 0; $y -lt $bmp.Height; $y++) {
    for ($x = 0; $x -lt $bmp.Width; $x++) {
        $p = $bmp.GetPixel($x, $y)
        # Difference from background
        $dist = [Math]::Sqrt([Math]::Pow($p.R - $avgR, 2) + [Math]::Pow($p.G - $avgG, 2) + [Math]::Pow($p.B - $avgB, 2))
        if ($dist -gt 25) {
            if ($x -lt $minX) { $minX = $x }
            if ($x -gt $maxX) { $maxX = $x }
            if ($y -lt $minY) { $minY = $y }
            if ($y -gt $maxY) { $maxY = $y }
        }
    }
}

Write-Host "Content bounds: X=$minX to $maxX, Y=$minY to $maxY"
$bmp.Dispose()
