using System.Threading.Tasks;
using Xunit;
using ZXing;
using ZXing.Rendering;
using JaperApp.Services;
using Windows.Foundation;

namespace JaperApp.Tests;

public class FallbackBarcodeScannerTests
{
    [Fact]
    public async Task DecodeAsync_ReturnsExpectedText()
    {
        var writer = new BarcodeWriterPixelData { Format = BarcodeFormat.QR_CODE };
        var pixelData = writer.Write("hello world");
        var scanner = new FallbackBarcodeScanner();
        await scanner.InitializeAsync();
        await scanner.ConfigureSymbologiesAsync(new[] { BarcodeSymbology.QRCode });
        string? result = await scanner.DecodeAsync(pixelData.Pixels, pixelData.Width, pixelData.Height, new Rect(0,0,pixelData.Width,pixelData.Height));
        Assert.Equal("hello world", result);
    }
}
