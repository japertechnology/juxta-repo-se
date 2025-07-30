using System;
using Microsoft.UI.Xaml;
using Microsoft.UI.Xaml.Controls;
using Microsoft.UI.Xaml.Automation.Peers;
using Microsoft.UI.Xaml.Automation;
using JaperApp.Services;
using Microsoft.UI.Dispatching;
using System.Linq;
using System.ComponentModel;

namespace JaperApp
{
    public sealed partial class MainWindow : Window
    {
        private readonly CameraService _cameraService;
        private readonly SymbologySettingsService _settingsService;
        private readonly RoiSettingsService _roiService;
        private readonly BarcodeScannerService _barcodeScannerService;
        private readonly RoiScanningService _scanningService;
        private readonly DispatcherQueueTimer _statusTimer;

        public MainWindow()
        {
            this.InitializeComponent();
            _cameraService = new CameraService(App.Settings);
            _settingsService = new SymbologySettingsService(App.Settings);
            _roiService = new RoiSettingsService(App.Settings);
            _settingsService.Load();
            _roiService.Load();
            _barcodeScannerService = new BarcodeScannerService(_settingsService);
            _scanningService = new RoiScanningService(_cameraService, _barcodeScannerService, _roiService);
            _scanningService.BarcodeDecoded += (_, text) =>
            {
                ResultText.Text = text;
                var peer = FrameworkElementAutomationPeer.FromElement(ResultText) ?? FrameworkElementAutomationPeer.CreatePeerForElement(ResultText);
                peer?.RaiseAutomationEvent(AutomationEvents.LiveRegionChanged);
                ClipboardService.SetText(text);
            };
            _statusTimer = DispatcherQueue.GetForCurrentThread().CreateTimer();
            _statusTimer.Interval = TimeSpan.FromSeconds(5);
            _statusTimer.Tick += (_, _) => { StatusText.Text = string.Empty; _statusTimer.Stop(); };
            ErrorService.ErrorReported += OnErrorReported;
            this.Loaded += MainWindow_Loaded;
            this.Closed += MainWindow_Closed;
            ReconnectButton.Click += ReconnectButton_Click;
            DeviceComboBox.SelectionChanged += DeviceComboBox_SelectionChanged;
            MirrorToggle.Toggled += MirrorToggle_Toggled;
            TorchToggle.Toggled += TorchToggle_Toggled;
            ResolutionComboBox.SelectionChanged += ResolutionComboBox_SelectionChanged;
            SettingsButton.Click += SettingsButton_Click;
            _cameraService.CaptureFailed += CameraService_Failure;
            _cameraService.DeviceRemoved += CameraService_Failure;
            _barcodeScannerService.PropertyChanged += BarcodeScannerService_PropertyChanged;
        }

        private async void MainWindow_Loaded(object sender, RoutedEventArgs e)
        {
            await _cameraService.EnumerateDevicesAsync();
            DeviceComboBox.ItemsSource = _cameraService.Devices;
            await _barcodeScannerService.InitializeAsync();
            EngineIndicatorText.Text = $"Engine: {_barcodeScannerService.CurrentEngineName}";
            var lastId = _cameraService.LoadLastDeviceId();
            if (lastId != null)
            {
                var device = _cameraService.Devices?.FirstOrDefault(d => d.Id == lastId);
                if (device != null)
                {
                    DeviceComboBox.SelectedItem = device;
                    return;
                }
            }
            DeviceComboBox.SelectedIndex = _cameraService.Devices?.Any() == true ? 0 : -1;

            if (!App.Settings.Settings.FirstRunShown)
            {
                await ShowFirstRunDialogAsync();
            }
        }

        private async void DeviceComboBox_SelectionChanged(object sender, SelectionChangedEventArgs e)
        {
            if (DeviceComboBox.SelectedItem is Windows.Devices.Enumeration.DeviceInformation info)
            {
                try
                {
                    await _cameraService.InitializeAsync(info.Id, PreviewElement);
                    ReconnectButton.Visibility = Visibility.Collapsed;
                    MirrorToggle.IsOn = false;
                    TorchToggle.IsOn = false;
                    await PopulateResolutionsAsync();
                    await _scanningService.StartAsync();
                }
                catch
                {
                    // ErrorService will have already displayed the message.
                }
            }
        }

        private async System.Threading.Tasks.Task PopulateResolutionsAsync()
        {
            var resolutions = await _cameraService.GetAvailableResolutionsAsync();
            ResolutionComboBox.ItemsSource = resolutions;
            ResolutionComboBox.SelectedIndex = 0;
        }

        private void BarcodeScannerService_PropertyChanged(object? sender, PropertyChangedEventArgs e)
        {
            if (e.PropertyName == nameof(BarcodeScannerService.CurrentEngineName))
            {
                EngineIndicatorText.Text = $"Engine: {_barcodeScannerService.CurrentEngineName}";
            }
        }

        private void MirrorToggle_Toggled(object sender, RoutedEventArgs e)
        {
            _cameraService.SetMirrored(MirrorToggle.IsOn, PreviewElement);
        }

        private void TorchToggle_Toggled(object sender, RoutedEventArgs e)
        {
            if (!_cameraService.ToggleTorch(TorchToggle.IsOn))
            {
                TorchToggle.IsEnabled = false;
            }
        }

        private async void ResolutionComboBox_SelectionChanged(object sender, SelectionChangedEventArgs e)
        {
            if (ResolutionComboBox.SelectedItem is Windows.Media.MediaProperties.VideoEncodingProperties props)
            {
                await _cameraService.SetResolutionAsync(props);
            }
        }

        private void CameraService_Failure(object? sender, System.EventArgs e)
        {
            ReconnectButton.Visibility = Visibility.Visible;
        }

        private async void ReconnectButton_Click(object sender, RoutedEventArgs e)
        {
            if (DeviceComboBox.SelectedItem is Windows.Devices.Enumeration.DeviceInformation info)
            {
                await _cameraService.InitializeAsync(info.Id, PreviewElement);
                ReconnectButton.Visibility = Visibility.Collapsed;
            }
        }

        private async void MainWindow_Closed(object sender, WindowEventArgs args)
        {
            _scanningService.Stop();
            await _cameraService.CleanupAsync();
            App.Queue?.Dispose();
            ErrorService.ErrorReported -= OnErrorReported;
        }

        private void SettingsButton_Click(object sender, RoutedEventArgs e)
        {
            var window = new SettingsWindow(_settingsService, _roiService);
            window.SettingsSaved += async (_, __) =>
            {
                await _barcodeScannerService.ApplySymbologiesAsync(_settingsService.GetEnabled());
                _scanningService.Stop();
                await _scanningService.StartAsync();
            };
            window.Activate();
        }

        private void OnErrorReported(object? sender, string message)
        {
            StatusText.Text = message;
            _statusTimer.Stop();
            _statusTimer.Start();
        }

        private async System.Threading.Tasks.Task ShowFirstRunDialogAsync()
        {
            var panel = new StackPanel { Spacing = 8 };
            panel.Children.Add(new TextBlock
            {
                Text = "JAPER uses your camera to scan barcodes. Processing occurs locally unless you enable network outputs."
            });
            var toggle = new ToggleSwitch
            {
                Header = "Enable telemetry",
                IsOn = App.Settings.Settings.TelemetryEnabled
            };
            panel.Children.Add(toggle);

            var dialog = new ContentDialog
            {
                Title = "Welcome",
                PrimaryButtonText = "OK",
                Content = panel,
                XamlRoot = this.Content.XamlRoot
            };

            await dialog.ShowAsync();
            App.Settings.Settings.TelemetryEnabled = toggle.IsOn;
            App.Settings.Settings.FirstRunShown = true;
            App.Settings.Save();
        }
    }
}
