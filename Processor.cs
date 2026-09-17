using System;
using System.Drawing;
using System.Drawing.Imaging;

public class ImageProcessor {
    public static void RemoveWhiteBackground(string inputPath, string outputPath, int threshold) {
        using (Bitmap src = new Bitmap(inputPath)) {
            using (Bitmap dest = new Bitmap(src.Width, src.Height, PixelFormat.Format32bppArgb)) {
                for (int y = 0; y < src.Height; y++) {
                    for (int x = 0; x < src.Width; x++) {
                        Color c = src.GetPixel(x, y);
                        // Check if pixel is white or near-white
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
    }
}
