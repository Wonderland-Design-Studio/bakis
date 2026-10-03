Add-Type -AssemblyName System.Drawing

$srcPath = "c:\Users\tsoan\OneDrive\Documents\GitHub\bakis\assets\images\bakis-logo-new.jpg"
$bmp = [System.Drawing.Bitmap]::FromFile($srcPath)

# 1. Clean trim saving directly with exact bounding box plus comfortable padding
$minX = 27
$maxX = 828
$minY = 6
$maxY = 361

$padX = 14
$padY = 10

$cropX = [Math]::Max(0, $minX - $padX)
$cropY = [Math]::Max(0, $minY - $padY)
$cropW = [Math]::Min($bmp.Width - $cropX, ($maxX - $minX + 1) + ($padX * 2))
$cropH = [Math]::Min($bmp.Height - $cropY, ($maxY - $minY + 1) + ($padY * 2))

$rect = New-Object System.Drawing.Rectangle($cropX, $cropY, $cropW, $cropH)
$cropped = $bmp.Clone($rect, $bmp.PixelFormat)

$outClean = "c:\Users\tsoan\OneDrive\Documents\GitHub\bakis\assets\images\bakis-logo-new-clean.png"
$cropped.Save($outClean, [System.Drawing.Imaging.ImageFormat]::Png)
Write-Host "Saved clean logo to $outClean ($cropW x $cropH)"

# 2. Transparent background version:
# Background is dark forest green (around R=24, G=39, B=32).
# Let's create a transparent PNG where the dark green background is converted to alpha.
# Note that the text and transmission towers are white/light green/grey, and circle has white background.
$transBmp = New-Object System.Drawing.Bitmap($cropped.Width, $cropped.Height, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)

# Background color reference
$bgR = 24.0
$bgG = 39.0
$bgB = 32.0

for ($y = 0; $y -lt $cropped.Height; $y++) {
    for ($x = 0; $x -lt $cropped.Width; $x++) {
        $p = $cropped.GetPixel($x, $y)
        # Compute difference from background
        # Notice brightness and chromatic difference
        $dr = [double]$p.R - $bgR
        $dg = [double]$p.G - $bgG
        $db = [double]$p.B - $bgB
        $dist = [Math]::Sqrt($dr*$dr + $dg*$dg + $db*$db)
        
        # Soft alpha feathering between 15 and 38 distance
        if ($dist -lt 16) {
            $transBmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(0, 0, 0, 0))
        } elseif ($dist -lt 36) {
            $alpha = [int](($dist - 16) / (36 - 16) * 255)
            $transBmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb($alpha, $p.R, $p.G, $p.B))
        } else {
            $transBmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(255, $p.R, $p.G, $p.B))
        }
    }
}

$outTrans = "c:\Users\tsoan\OneDrive\Documents\GitHub\bakis\assets\images\bakis-logo-new-transparent.png"
$transBmp.Save($outTrans, [System.Drawing.Imaging.ImageFormat]::Png)
Write-Host "Saved transparent logo to $outTrans"

# Also create updated favicon from the emblem part!
# Emblem is in circle from X ~ 27 to 320, Y ~ 10 to 350
$emblemRect = New-Object System.Drawing.Rectangle(20, 0, 310, 360)
$emblemCrop = $bmp.Clone($emblemRect, $bmp.PixelFormat)
$emblemOut = "c:\Users\tsoan\OneDrive\Documents\GitHub\bakis\assets\images\bakis-emblem.png"
$emblemCrop.Save($emblemOut, [System.Drawing.Imaging.ImageFormat]::Png)
Write-Host "Saved emblem to $emblemOut"

$cropped.Dispose()
$transBmp.Dispose()
$emblemCrop.Dispose()
$bmp.Dispose()
