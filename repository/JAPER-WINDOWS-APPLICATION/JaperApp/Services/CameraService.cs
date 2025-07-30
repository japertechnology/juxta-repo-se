using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Windows.Media.Capture;
using Windows.Media.MediaProperties;
using Windows.Devices.Enumeration;
using Windows.Graphics.Imaging;
using Windows.Storage.Streams;
using Microsoft.UI.Xaml.Controls;
using JaperApp.Resources;
using Microsoft.UI.Xaml.Media;
using Microsoft.UI.Xaml.Media.Imaging;

namespace JaperApp.Services
{
    public class CameraService
    {
        private readonly SettingsService _settings;
        private MediaCapture? _mediaCapture;
        public IReadOnlyList<DeviceInformation>? Devices { get; private set; }
        public event EventHandler? CaptureFailed;
        public event EventHandler? DeviceRemoved;
        public CameraService(SettingsService settings)
        {
            _settings = settings;
        }

        public async Task EnumerateDevicesAsync()
        {
            Devices = await DeviceInformation.FindAllAsync(DeviceClass.VideoCapture);
        }

        public async Task InitializeAsync(string? deviceId, CaptureElement preview)
        {
            if (_mediaCapture != null)
            {
                await CleanupAsync();
            }
            _mediaCapture = new MediaCapture();
            var settings = new MediaCaptureInitializationSettings
            {
                VideoDeviceId = deviceId,
                StreamingCaptureMode = StreamingCaptureMode.Video
            };
            try
            {
                await _mediaCapture.InitializeAsync(settings);
            }
            catch (UnauthorizedAccessException)
            {
                await ErrorService.ReportErrorAsync(Resources.Strings.CameraPermissionDenied, true);
                throw;
            }
            _mediaCapture.Failed += MediaCapture_Failed;
            _mediaCapture.CameraStreamStateChanged += MediaCapture_CameraStreamStateChanged;

            preview.Source = _mediaCapture;
            await _mediaCapture.StartPreviewAsync();

            if (!string.IsNullOrEmpty(deviceId))
            {
                _settings.Settings.CameraDeviceId = deviceId;
                _settings.Save();
            }
        }

        private void MediaCapture_CameraStreamStateChanged(MediaCapture sender, object args)
        {
            if (sender.CameraStreamState == CameraStreamState.Shutdown)
            {
                DeviceRemoved?.Invoke(this, EventArgs.Empty);
            }
        }

        private void MediaCapture_Failed(MediaCapture sender, MediaCaptureFailedEventArgs errorEventArgs)
        {
            CaptureFailed?.Invoke(this, EventArgs.Empty);
        }

        public async Task<IEnumerable<VideoEncodingProperties>> GetAvailableResolutionsAsync()
        {
            if (_mediaCapture == null) return Enumerable.Empty<VideoEncodingProperties>();
            var controller = _mediaCapture.VideoDeviceController;
            return controller.GetAvailableMediaStreamProperties(MediaStreamType.VideoRecord)
                              .Select(p => p as VideoEncodingProperties)
                              .Where(p => p != null)!
                              .Cast<VideoEncodingProperties>();
        }

        public async Task SetResolutionAsync(VideoEncodingProperties props)
        {
            if (_mediaCapture == null) return;
            await _mediaCapture.VideoDeviceController.SetMediaStreamPropertiesAsync(MediaStreamType.VideoRecord, props);
            await _mediaCapture.VideoDeviceController.SetMediaStreamPropertiesAsync(MediaStreamType.VideoPreview, props);
        }

        public bool ToggleTorch(bool on)
        {
            if (_mediaCapture == null) return false;
            var torch = _mediaCapture.VideoDeviceController.TorchControl;
            if (!torch.Supported) return false;
            torch.Enabled = on;
            return true;
        }

        public void SetMirrored(bool mirrored, CaptureElement preview)
        {
            if (preview == null) return;
            preview.RenderTransform = new ScaleTransform
            {
                ScaleX = mirrored ? -1 : 1,
                CenterX = 0.5,
                CenterY = 0.5
            };
        }

        public async Task CleanupAsync()
        {
            if (_mediaCapture != null)
            {
                _mediaCapture.Failed -= MediaCapture_Failed;
                _mediaCapture.CameraStreamStateChanged -= MediaCapture_CameraStreamStateChanged;
                await _mediaCapture.StopPreviewAsync();
                _mediaCapture.Dispose();
                _mediaCapture = null;
            }
        }

        public string? LoadLastDeviceId()
        {
            return _settings.Settings.CameraDeviceId;
        }

        public async Task<(byte[] Pixels, int Width, int Height)?> CaptureFrameAsync()
        {
            if (_mediaCapture == null) return null;
            var properties = _mediaCapture.VideoDeviceController.GetMediaStreamProperties(MediaStreamType.VideoPreview) as VideoEncodingProperties;
            if (properties == null) return null;

            using var frame = new Windows.Media.VideoFrame(BitmapPixelFormat.Bgra8, (int)properties.Width, (int)properties.Height);
            await _mediaCapture.GetPreviewFrameAsync(frame);
            var bitmap = frame.SoftwareBitmap;
            if (bitmap == null) return null;

            var buffer = new Windows.Storage.Streams.Buffer((uint)(bitmap.PixelWidth * bitmap.PixelHeight * 4));
            bitmap.CopyToBuffer(buffer);
            var reader = Windows.Storage.Streams.DataReader.FromBuffer(buffer);
            byte[] data = new byte[buffer.Length];
            reader.ReadBytes(data);
            reader.Dispose();
            return (data, bitmap.PixelWidth, bitmap.PixelHeight);
        }
    }
}
