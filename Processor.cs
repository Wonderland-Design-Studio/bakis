using System;
using System.Drawing;
using System.Drawing.Imaging;
using System.Collections.Generic;

public class ImageProcessor {
    private static bool IsWhiteOrLight(Color c, int edgeThreshold) {
        int min = Math.Min(c.R, Math.Min(c.G, c.B));
        int max = Math.Max(c.R, Math.Max(c.G, c.B));
        int diff = max - min;
        return (min >= edgeThreshold && diff <= 35) || (min >= 242);
    }

    public static void RemoveBackgroundFloodFill(string inputPath, string outputPath, int edgeThreshold) {
        using (Bitmap src = new Bitmap(inputPath)) {
            int w = src.Width;
            int h = src.Height;
            bool[,] visited = new bool[w, h];
            bool[,] isBg = new bool[w, h];

            Queue<Point> q = new Queue<Point>();

            for (int x = 0; x < w; x++) {
                if (IsWhiteOrLight(src.GetPixel(x, 0), edgeThreshold)) { q.Enqueue(new Point(x, 0)); visited[x, 0] = true; }
                if (IsWhiteOrLight(src.GetPixel(x, h - 1), edgeThreshold)) { q.Enqueue(new Point(x, h - 1)); visited[x, h - 1] = true; }
            }
            for (int y = 0; y < h; y++) {
                if (!visited[0, y] && IsWhiteOrLight(src.GetPixel(0, y), edgeThreshold)) { q.Enqueue(new Point(0, y)); visited[0, y] = true; }
                if (!visited[w - 1, y] && IsWhiteOrLight(src.GetPixel(w - 1, y), edgeThreshold)) { q.Enqueue(new Point(w - 1, y)); visited[w - 1, y] = true; }
            }

            int[] dx = { 0, 0, 1, -1, 1, -1, 1, -1 };
            int[] dy = { 1, -1, 0, 0, 1, 1, -1, -1 };

            while (q.Count > 0) {
                Point p = q.Dequeue();
                isBg[p.X, p.Y] = true;

                for (int i = 0; i < 8; i++) {
                    int nx = p.X + dx[i];
                    int ny = p.Y + dy[i];
                    if (nx >= 0 && nx < w && ny >= 0 && ny < h && !visited[nx, ny]) {
                        Color nc = src.GetPixel(nx, ny);
                        if (IsWhiteOrLight(nc, edgeThreshold)) {
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
                            int min = Math.Min(c.R, Math.Min(c.G, c.B));
                            if (min >= 250) {
                                dest.SetPixel(x, y, Color.FromArgb(0, 0, 0, 0));
                            } else {
                                dest.SetPixel(x, y, c);
                            }
                        }
                    }
                }
                dest.Save(outputPath, ImageFormat.Png);
            }
        }
        Console.WriteLine("Processed flood fill: " + outputPath);
    }

    public static void SimpleRemove(string inputPath, string outputPath, int threshold) {
        using (Bitmap src = new Bitmap(inputPath)) {
            using (Bitmap dest = new Bitmap(src.Width, src.Height, PixelFormat.Format32bppArgb)) {
                for (int y = 0; y < src.Height; y++) {
                    for (int x = 0; x < src.Width; x++) {
                        Color c = src.GetPixel(x, y);
                        if (c.R >= threshold && c.G >= threshold && c.B >= threshold) {
                            dest.SetPixel(x, y, Color.FromArgb(0, 0, 0, 0));
                        } else {
                            dest.SetPixel(x, y, c);
                        }
                    }
                }
                dest.Save(outputPath, ImageFormat.Png);
            }
        }
        Console.WriteLine("Processed simple: " + outputPath);
    }

    public static void Main(string[] args) {
        RemoveBackgroundFloodFill(
            @"C:\Users\tsoan\.gemini\antigravity\brain\9370f19a-55c2-4cd6-bc8d-0ec81693664e\.user_uploaded\media_1789652394045.jpg",
            @"assets\images\product-fuse-link-trans.png",
            215
        );

        SimpleRemove(
            @"C:\Users\tsoan\.gemini\antigravity\brain\9370f19a-55c2-4cd6-bc8d-0ec81693664e\.user_uploaded\media_1789652394046.jpg",
            @"assets\images\product-surge-arrestors-trans.png",
            225
        );

        RemoveBackgroundFloodFill(
            @"C:\Users\tsoan\.gemini\antigravity\brain\9370f19a-55c2-4cd6-bc8d-0ec81693664e\.user_uploaded\media_1789652397048.jpg",
            @"assets\images\product-insulators-trans.png",
            215
        );
    }
}
