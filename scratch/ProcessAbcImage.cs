using System;
using System.Drawing;
using System.Drawing.Imaging;
using System.IO;
using System.Collections.Generic;

public class ProcessAbcImage {
    private static bool IsWhiteOrLight(Color c, int threshold) {
        return c.R >= threshold && c.G >= threshold && c.B >= threshold;
    }

    public static void RemoveBackgroundFloodFill(string inputPath, string outputPath, int threshold, int featherPx) {
        using (Bitmap src = new Bitmap(inputPath)) {
            int w = src.Width;
            int h = src.Height;
            bool[,] visited = new bool[w, h];
            bool[,] isBg = new bool[w, h];

            Queue<Point> q = new Queue<Point>();

            // Seed border pixels
            for (int x = 0; x < w; x++) {
                if (IsWhiteOrLight(src.GetPixel(x, 0), threshold)) { q.Enqueue(new Point(x, 0)); visited[x, 0] = true; }
                if (IsWhiteOrLight(src.GetPixel(x, h - 1), threshold)) { q.Enqueue(new Point(x, h - 1)); visited[x, h - 1] = true; }
            }
            for (int y = 0; y < h; y++) {
                if (!visited[0, y] && IsWhiteOrLight(src.GetPixel(0, y), threshold)) { q.Enqueue(new Point(0, y)); visited[0, y] = true; }
                if (!visited[w - 1, y] && IsWhiteOrLight(src.GetPixel(w - 1, y), threshold)) { q.Enqueue(new Point(w - 1, y)); visited[w - 1, y] = true; }
            }

            int[] dx = { 0, 0, 1, -1 };
            int[] dy = { 1, -1, 0, 0 };

            while (q.Count > 0) {
                Point p = q.Dequeue();
                isBg[p.X, p.Y] = true;

                for (int i = 0; i < 4; i++) {
                    int nx = p.X + dx[i];
                    int ny = p.Y + dy[i];
                    if (nx >= 0 && nx < w && ny >= 0 && ny < h && !visited[nx, ny]) {
                        Color nc = src.GetPixel(nx, ny);
                        if (IsWhiteOrLight(nc, threshold)) {
                            visited[nx, ny] = true;
                            q.Enqueue(new Point(nx, ny));
                        }
                    }
                }
            }

            using (Bitmap dest = new Bitmap(w, h, PixelFormat.Format32bppArgb)) {
                for (int y = 0; y < h; y++) {
                    for (int x = 0; x < w; x++) {
                        Color c = src.GetPixel(x, y);
                        if (isBg[x, y]) {
                            dest.SetPixel(x, y, Color.FromArgb(0, 0, 0, 0));
                        } else {
                            bool nearBg = false;
                            for (int d = 1; d <= featherPx && !nearBg; d++) {
                                if ((x >= d && isBg[x - d, y]) ||
                                    (x + d < w && isBg[x + d, y]) ||
                                    (y >= d && isBg[x, y - d]) ||
                                    (y + d < h && isBg[x, y + d])) {
                                    nearBg = true;
                                }
                            }

                            if (nearBg && c.R >= 220 && c.G >= 220 && c.B >= 220) {
                                double brightness = (c.R + c.G + c.B) / 3.0;
                                int alpha = (int)Math.Max(0, Math.Min(255, (255 - brightness) * 8));
                                dest.SetPixel(x, y, Color.FromArgb(alpha, c.R, c.G, c.B));
                            } else {
                                dest.SetPixel(x, y, Color.FromArgb(255, c.R, c.G, c.B));
                            }
                        }
                    }
                }
                dest.Save(outputPath, ImageFormat.Png);
            }
        }
        Console.WriteLine("Generated transparent PNG: " + outputPath);
    }

    public static void Main(string[] args) {
        string input = @"C:\Users\tsoan\.gemini\antigravity-ide\brain\9e34c8d7-f139-4d58-9006-02a807b07f04\.user_uploaded\media_1791347112264.jpg";
        string assetsDir = @"assets\images";

        string abcJpg = Path.Combine(assetsDir, "product-abc-accessories.jpg");
        string abcTransPng = Path.Combine(assetsDir, "product-abc-accessories-trans.png");
        string ipcJpg = Path.Combine(assetsDir, "product-ipc-connector.jpg");
        string ipcTransPng = Path.Combine(assetsDir, "product-ipc-connector-trans.png");

        File.Copy(input, abcJpg, true);
        File.Copy(input, ipcJpg, true);
        Console.WriteLine("Copied input JPG to: " + abcJpg + " and " + ipcJpg);

        // Remove background with threshold 240
        RemoveBackgroundFloodFill(input, abcTransPng, 240, 2);
        File.Copy(abcTransPng, ipcTransPng, true);
        Console.WriteLine("Copied transparent PNG to: " + ipcTransPng);
    }
}
