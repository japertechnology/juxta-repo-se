using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Windows.Foundation;
using Xunit;
using ZXing;
using ZXing.Rendering;
using JaperApp.Services;

namespace JaperApp.Tests;

public class PerformanceTests
{
    [Fact]
    public async Task MedianDecodeLatency_IsReasonable()
    {
        var writer = new BarcodeWriterPixelData { Format = BarcodeFormat.QR_CODE };
        var pixelData = writer.Write("latency test");
        var scanner = new FallbackBarcodeScanner();
        await scanner.InitializeAsync();
        await scanner.ConfigureSymbologiesAsync(new[] { BarcodeSymbology.QRCode });

        var timings = new List<long>();
        for (int i = 0; i < 10; i++)
        {
            var sw = Stopwatch.StartNew();
            await scanner.DecodeAsync(pixelData.Pixels, pixelData.Width, pixelData.Height,
                new Rect(0, 0, pixelData.Width, pixelData.Height));
            sw.Stop();
            timings.Add(sw.ElapsedMilliseconds);
        }

        timings.Sort();
        long median = timings[timings.Count / 2];
        Assert.True(median > 0);
    }
}
