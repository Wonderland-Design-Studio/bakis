$html = Get-Content -Path 'bakis_contact.html' -Raw -Encoding UTF8
$text = [System.Text.RegularExpressions.Regex]::Replace($html, '<script[\s\S]*?</script>', '')
$text = [System.Text.RegularExpressions.Regex]::Replace($text, '<style[\s\S]*?</style>', '')
$text = [System.Text.RegularExpressions.Regex]::Replace($text, '<[^>]+>', "`n")
$lines = $text -split "`n" | ForEach-Object { $_.Trim() } | Where-Object { $_.Length -gt 0 }
$lines | Select-Object -Unique | Out-File -FilePath 'bakis_contact_text.txt' -Encoding UTF8
Write-Host "Contact page lines: $($lines.Count)"
