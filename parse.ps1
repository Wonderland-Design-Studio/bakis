$html = Get-Content -Path 'bakis_raw.html' -Raw -Encoding UTF8
$text = [System.Text.RegularExpressions.Regex]::Replace($html, '<script[\s\S]*?</script>', '')
$text = [System.Text.RegularExpressions.Regex]::Replace($text, '<style[\s\S]*?</style>', '')
$text = [System.Text.RegularExpressions.Regex]::Replace($text, '<[^>]+>', "`n")
$lines = $text -split "`n" | ForEach-Object { $_.Trim() } | Where-Object { $_.Length -gt 0 }
$lines | Out-File -FilePath 'bakis_clean_text.txt' -Encoding UTF8
Write-Host "Total lines: $($lines.Count)"

$pattern = '<img[^>]+src=["'']([^"'']+)["'']'
$matches = [System.Text.RegularExpressions.Regex]::Matches($html, $pattern, [System.Text.RegularExpressions.RegexOptions]::IgnoreCase)
$imgs = foreach ($m in $matches) { $m.Groups[1].Value }
$imgs | Select-Object -Unique | Out-File -FilePath 'bakis_images.txt' -Encoding UTF8
Write-Host "Unique images: $(($imgs | Select-Object -Unique).Count)"
