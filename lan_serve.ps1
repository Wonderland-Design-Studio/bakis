$port = 8080
$tcpListener = New-Object System.Net.Sockets.TcpListener([System.Net.IPAddress]::Any, $port)
$tcpListener.Start()
Write-Host "TCP Server listening on all interfaces on port $port"
Write-Host "Local network IP: http://192.168.0.153:$port/"

while ($true) {
    $client = $tcpListener.AcceptTcpClient()
    [System.Threading.ThreadPool]::QueueUserWorkItem({
        param($cli)
        try {
            $stream = $cli.GetStream()
            $reader = New-Object System.IO.StreamReader($stream)
            $line = $reader.ReadLine()

            if (-not [string]::IsNullOrEmpty($line)) {
                $parts = $line.Split(' ')
                $path = $parts[1].TrimStart('/')
                if ([string]::IsNullOrEmpty($path)) { $path = "index.html" }
                $cleanPath = $path.Split('?')[0].Replace('/', [System.IO.Path]::DirectorySeparatorChar)
                $filePath = Join-Path "C:\Users\tsoan\OneDrive\Documents\GitHub\bakis" $cleanPath

                if (Test-Path $filePath -PathType Leaf) {
                    $bytes = [System.IO.File]::ReadAllBytes($filePath)
                    $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
                    $ct = switch ($ext) {
                        ".html" { "text/html; charset=utf-8" }
                        ".css"  { "text/css; charset=utf-8" }
                        ".js"   { "application/javascript; charset=utf-8" }
                        ".png"  { "image/png" }
                        ".jpg"  { "image/jpeg" }
                        ".jpeg" { "image/jpeg" }
                        ".svg"  { "image/svg+xml" }
                        ".mp4"  { "video/mp4" }
                        ".webm" { "video/webm" }
                        default { "application/octet-stream" }
                    }
                    $header = "HTTP/1.1 200 OK`r`nContent-Type: $ct`r`nContent-Length: $($bytes.Length)`r`nAccess-Control-Allow-Origin: *`r`nConnection: close`r`n`r`n"
                    $headerBytes = [System.Text.Encoding]::ASCII.GetBytes($header)
                    $stream.Write($headerBytes, 0, $headerBytes.Length)
                    $stream.Write($bytes, 0, $bytes.Length)
                } else {
                    $notFound = "HTTP/1.1 404 Not Found`r`nContent-Length: 0`r`nConnection: close`r`n`r`n"
                    $headerBytes = [System.Text.Encoding]::ASCII.GetBytes($notFound)
                    $stream.Write($headerBytes, 0, $headerBytes.Length)
                }
            }
            $stream.Flush()
            $cli.Close()
        } catch {
            if ($cli) { $cli.Close() }
        }
    }, $client) | Out-Null
}
