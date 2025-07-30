using System.Collections.Generic;
using System.Linq;
using System;
using System.Threading.Tasks;
using Windows.Devices.PointOfService;

namespace JaperApp.Services
{
    /// <summary>
    /// Wrapper around Windows.Devices.PointOfService.BarcodeScanner
    /// </summary>
    public class NativeBarcodeScanner : IBarcodeScanner
    {
        private BarcodeScanner? _scanner;
        private ClaimedBarcodeScanner? _claimed;

        public string Name => "Native Engine";

        public async Task<bool> InitializeAsync()
        {
            _scanner = await BarcodeScanner.GetDefaultAsync();
            if (_scanner == null)
            {
                return false;
            }

            _claimed = await _scanner.ClaimScannerAsync();
            if (_claimed == null)
            {
                return false;
            }

            await _claimed.EnableAsync();
            return true;
        }

        public async Task ConfigureSymbologiesAsync(IEnumerable<BarcodeSymbology> symbologies)
        {
            if (_claimed == null) return;
            var values = symbologies.Select(MapSymbology);
            await _claimed.SetActiveSymbologiesAsync(values);
        }

        public Task<string?> DecodeAsync(byte[] pixels, int width, int height, Windows.Foundation.Rect roi)
        {
            // Native scanners handle decoding internally; frame decoding is not supported here.
            return Task.FromResult<string?>(null);
        }

        private static uint MapSymbology(BarcodeSymbology s) => s switch
        {
            BarcodeSymbology.QRCode => BarcodeSymbologies.Qr,
            BarcodeSymbology.Code128 => BarcodeSymbologies.Code128,
            BarcodeSymbology.Code39 => BarcodeSymbologies.Code39,
            BarcodeSymbology.EAN13 => BarcodeSymbologies.Ean13,
            BarcodeSymbology.EAN8 => BarcodeSymbologies.Ean8,
            BarcodeSymbology.ITF => BarcodeSymbologies.TfInt,
            BarcodeSymbology.DataMatrix => BarcodeSymbologies.DataMatrix,
            BarcodeSymbology.PDF417 => BarcodeSymbologies.Pdf417,
            _ => 0
        };
    }
}
