Add-Type -AssemblyName System.Drawing

$surgePath = "C:\Users\tsoan\.gemini\antigravity-ide\brain\9e34c8d7-f139-4d58-9006-02a807b07f04\.user_uploaded\media_1791301476339.jpg"
$bmp = New-Object System.Drawing.Bitmap($surgePath)
$w = $bmp.Width
$h = $bmp.Height
Write-Host "Surge image size: $w x $h"

# Sample 4 corners
$c00 = $bmp.GetPixel(0, 0)
$c10 = $bmp.GetPixel($w - 1, 0)
$c01 = $bmp.GetPixel(0, $h - 1)
$c11 = $bmp.GetPixel($w - 1, $h - 1)
Write-Host "Corner 0,0: R=$($c00.R) G=$($c00.G) B=$($c00.B)"
Write-Host "Corner top-right: R=$($c10.R) G=$($c10.G) B=$($c10.B)"
Write-Host "Corner bottom-left: R=$($c01.R) G=$($c01.G) B=$($c01.B)"
Write-Host "Corner bottom-right: R=$($c11.R) G=$($c11.G) B=$($c11.B)"
$bmp.Dispose()
