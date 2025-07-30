using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.UI.Dispatching;
using Windows.Foundation;
using Windows.Media.MediaProperties;

namespace JaperApp.Services
{
    /// <summary>
    /// Continuously captures frames, crops them based on ROI settings and decodes barcodes.
    /// </summary>
    public class RoiScanningService
    {
        private readonly CameraService _camera;
        private readonly BarcodeScannerService _scanner;
        private readonly RoiSettingsService _roi;
        private readonly DispatcherQueueTimer _timer;
        private bool _isDecoding;
        private IList<VideoEncodingProperties>? _resolutions;
        private int _resolutionIndex;
        private int _failCount;
        private string? _lastBarcode;
        private DateTimeOffset _lastBarcodeTime;
        private static readonly TimeSpan DuplicateCooldown = TimeSpan.FromSeconds(2);
        private const int FailThreshold = 5;

        public event EventHandler<string>? BarcodeDecoded;

        public RoiScanningService(CameraService camera, BarcodeScannerService scanner, RoiSettingsService roi)
        {
            _camera = camera;
            _scanner = scanner;
            _roi = roi;
            _timer = DispatcherQueue.GetForCurrentThread().CreateTimer();
            _timer.Interval = TimeSpan.FromMilliseconds(66); // ~15 FPS
            _timer.IsRepeating = true;
            _timer.Tick += Timer_Tick;
        }

        public async Task StartAsync()
        {
            if (_timer.IsRunning) return;
            _resolutions = (await _camera.GetAvailableResolutionsAsync()).OrderBy(r => r.Width).ToList();
            _resolutionIndex = 0;
            if (_resolutions.Count > 0)
            {
                await _camera.SetResolutionAsync(_resolutions[_resolutionIndex]);
            }
            _timer.Start();
        }

        public void Stop()
        {
            if (_timer.IsRunning)
            {
                _timer.Stop();
            }
        }

        private async void Timer_Tick(DispatcherQueueTimer sender, object args)
        {
            if (_isDecoding) return;
            _isDecoding = true;

            try
            {
                var frame = await _camera.CaptureFrameAsync();
                bool success = false;
                if (frame != null && _scanner.Engine != null)
                {
                    var rect = _roi.CalculatePixelRect(frame.Value.Width, frame.Value.Height);
                    string? text = await Task.Run(() =>
                        _scanner.Engine!.DecodeAsync(frame.Value.Pixels, frame.Value.Width, frame.Value.Height, rect)).Unwrap();
                    if (!string.IsNullOrEmpty(text))
                    {
                        success = true;
                        var now = DateTimeOffset.UtcNow;
                        if (text != _lastBarcode || (now - _lastBarcodeTime) > DuplicateCooldown)
                        {
                            _lastBarcode = text;
                            _lastBarcodeTime = now;
                            BarcodeDecoded?.Invoke(this, text);
                            TelemetryService.LogEvent("BarcodeDecoded");
                        }
                    }
                }

                await AdjustResolutionAsync(success);
            }
            finally
            {
                _isDecoding = false;
            }
        }

        private async Task AdjustResolutionAsync(bool success)
        {
            if (_resolutions == null || _resolutions.Count == 0) return;

            if (success)
            {
                _failCount = 0;
                if (_resolutionIndex > 0)
                {
                    _resolutionIndex = 0;
                    await _camera.SetResolutionAsync(_resolutions[_resolutionIndex]);
                }
            }
            else
            {
                _failCount++;
                if (_failCount >= FailThreshold && _resolutionIndex + 1 < _resolutions.Count)
                {
                    _resolutionIndex++;
                    _failCount = 0;
                    await _camera.SetResolutionAsync(_resolutions[_resolutionIndex]);
                }
            }
        }
    }
}
