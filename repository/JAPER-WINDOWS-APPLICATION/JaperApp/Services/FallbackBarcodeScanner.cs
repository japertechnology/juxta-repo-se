using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ZXing;
using Windows.Foundation;

namespace JaperApp.Services
{
    /// <summary>
    /// CPU based barcode scanner using ZXing.Net
    /// </summary>
    public class FallbackBarcodeScanner : IBarcodeScanner
    {
        private readonly IBarcodeReader _reader = new BarcodeReader();
        public string Name => "ZXing.Net";

        public Task<bool> InitializeAsync()
        {
            // No initialization needed for ZXing based scanner
            return Task.FromResult(true);
        }

        public Task ConfigureSymbologiesAsync(IEnumerable<BarcodeSymbology> symbologies)
        {
            _reader.Options.PossibleFormats = symbologies.Select(Map).ToList();
            return Task.CompletedTask;
        }

        public Task<string?> DecodeAsync(byte[] pixels, int width, int height, Windows.Foundation.Rect roi)
        {
            return Task.Run(() =>
            {
                int bytesPerPixel = 4;
                int x = Math.Clamp((int)roi.X, 0, width - 1);
                int y = Math.Clamp((int)roi.Y, 0, height - 1);
                int w = Math.Clamp((int)roi.Width, 0, width - x);
                int h = Math.Clamp((int)roi.Height, 0, height - y);
                if (w <= 0 || h <= 0) return (string?)null;

                var cropped = new byte[w * h * bytesPerPixel];
                for (int row = 0; row < h; row++)
                {
                    var srcOffset = ((row + y) * width + x) * bytesPerPixel;
                    var destOffset = row * w * bytesPerPixel;
                    System.Buffer.BlockCopy(pixels, srcOffset, cropped, destOffset, w * bytesPerPixel);
                }

                var result = _reader.Decode(cropped, w, h, RGBLuminanceSource.BitmapFormat.BGRA32);
                return result?.Text;
            });
        }

        private static BarcodeFormat Map(BarcodeSymbology s) => s switch
        {
            BarcodeSymbology.QRCode => BarcodeFormat.QR_CODE,
            BarcodeSymbology.Code128 => BarcodeFormat.CODE_128,
            BarcodeSymbology.Code39 => BarcodeFormat.CODE_39,
            BarcodeSymbology.EAN13 => BarcodeFormat.EAN_13,
            BarcodeSymbology.EAN8 => BarcodeFormat.EAN_8,
            BarcodeSymbology.ITF => BarcodeFormat.ITF,
            BarcodeSymbology.DataMatrix => BarcodeFormat.DATA_MATRIX,
            BarcodeSymbology.PDF417 => BarcodeFormat.PDF_417,
            _ => BarcodeFormat.QR_CODE
        };
    }
}
