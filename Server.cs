using System;
using System.IO;
using System.Net;
using System.Net.Sockets;
using System.Text;
using System.Threading;

class SimpleServer {
    static void Main(string[] args) {
        int port = 8080;
        TcpListener listener = new TcpListener(IPAddress.Any, port);
        listener.Start();
        Console.WriteLine("SERVER_READY http://192.168.0.153:" + port + "/");

        string baseDir = Directory.GetCurrentDirectory();

        while (true) {
            try {
                TcpClient client = listener.AcceptTcpClient();
                ThreadPool.QueueUserWorkItem(state => {
                    TcpClient c = (TcpClient)state;
                    try {
                        using (NetworkStream stream = c.GetStream()) {
                            byte[] buffer = new byte[4096];
                            int read = stream.Read(buffer, 0, buffer.Length);
                            if (read <= 0) return;

                            string request = Encoding.UTF8.GetString(buffer, 0, read);
                            string[] lines = request.Split(new[] { "\r\n", "\n" }, StringSplitOptions.None);
                            if (lines.Length == 0) return;

                            string[] tokens = lines[0].Split(' ');
                            if (tokens.Length < 2) return;

                            string urlPath = tokens[1].TrimStart('/');
                            if (string.IsNullOrEmpty(urlPath)) urlPath = "index.html";
                            if (urlPath.Contains("?")) urlPath = urlPath.Substring(0, urlPath.IndexOf('?'));

                            urlPath = urlPath.Replace('/', Path.DirectorySeparatorChar);
                            string filePath = Path.Combine(baseDir, urlPath);

                            if (File.Exists(filePath)) {
                                byte[] fileBytes = File.ReadAllBytes(filePath);
                                string ext = Path.GetExtension(filePath).ToLower();
                                string contentType = "application/octet-stream";
                                if (ext == ".html") contentType = "text/html; charset=utf-8";
                                else if (ext == ".css") contentType = "text/css; charset=utf-8";
                                else if (ext == ".js") contentType = "application/javascript; charset=utf-8";
                                else if (ext == ".png") contentType = "image/png";
                                else if (ext == ".jpg" || ext == ".jpeg") contentType = "image/jpeg";
                                else if (ext == ".svg") contentType = "image/svg+xml";
                                else if (ext == ".mp4") contentType = "video/mp4";
                                else if (ext == ".webm") contentType = "video/webm";

                                string header = "HTTP/1.1 200 OK\r\n" +
                                               "Content-Type: " + contentType + "\r\n" +
                                               "Content-Length: " + fileBytes.Length + "\r\n" +
                                               "Access-Control-Allow-Origin: *\r\n" +
                                               "Connection: close\r\n\r\n";
                                byte[] headerBytes = Encoding.ASCII.GetBytes(header);
                                stream.Write(headerBytes, 0, headerBytes.Length);
                                stream.Write(fileBytes, 0, fileBytes.Length);
                            } else {
                                string notFound = "HTTP/1.1 404 Not Found\r\nContent-Length: 0\r\nConnection: close\r\n\r\n";
                                byte[] notFoundBytes = Encoding.ASCII.GetBytes(notFound);
                                stream.Write(notFoundBytes, 0, notFoundBytes.Length);
                            }
                        }
                    } catch {
                    } finally {
                        try { c.Close(); } catch {}
                    }
                }, client);
            } catch (Exception ex) {
                Console.WriteLine("Error: " + ex.Message);
            }
        }
    }
}
