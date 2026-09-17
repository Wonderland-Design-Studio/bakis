Add-Type -AssemblyName System.Drawing

function Crop-TransparentPadding {
    param(
        [string]$InputPath,
        [string]$OutputPath
    )

    $bitmap = [System.Drawing.Bitmap]::FromFile($InputPath)
    $minX = $bitmap.Width
    $minY = $bitmap.Height
    $maxX = 0
    $maxY = 0

    for ($y = 0; $y -lt $bitmap.Height; $y++) {
        for ($x = 0; $x -lt $bitmap.Width; $x++) {
            $pixel = $bitmap.GetPixel($x, $y)
            if ($pixel.A -gt 10) {
                if ($x -lt $minX) { $minX = $x }
                if ($x -gt $maxX) { $maxX = $x }
                if ($y -lt $minY) { $minY = $y }
                if ($y -gt $maxY) { $maxY = $y }
            }
        }
    }

    Write-Host "Bounds for $InputPath -> X: $minX to $maxX, Y: $minY to $maxY"
    $cropWidth = $maxX - $minX + 1
    $cropHeight = $maxY - $minY + 1

    $rect = New-Object System.Drawing.Rectangle($minX, $minY, $cropWidth, $cropHeight)
    $cropped = $bitmap.Clone($rect, $bitmap.PixelFormat)
    $bitmap.Dispose()

    $cropped.Save($OutputPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $cropped.Dispose()
    Write-Host "Saved trimmed logo to $OutputPath"
}

Crop-TransparentPadding -InputPath "c:\Users\tsoan\OneDrive\Documents\GitHub\bakis\assets\images\logo-dark.png" -OutputPath "c:\Users\tsoan\OneDrive\Documents\GitHub\bakis\assets\images\logo-dark-trimmed.png"
Crop-TransparentPadding -InputPath "c:\Users\tsoan\OneDrive\Documents\GitHub\bakis\assets\images\logo-white.png" -OutputPath "c:\Users\tsoan\OneDrive\Documents\GitHub\bakis\assets\images\logo-white-trimmed.png"
