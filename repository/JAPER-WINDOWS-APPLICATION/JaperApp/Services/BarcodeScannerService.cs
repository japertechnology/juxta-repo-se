using System.Collections.Generic;
using System.ComponentModel;
using System.Runtime.CompilerServices;
using System.Threading.Tasks;
using JaperApp.Resources;

namespace JaperApp.Services
{
    /// <summary>
    /// Chooses between the native and fallback scanner engines.
    /// </summary>
    public class BarcodeScannerService : INotifyPropertyChanged
    {
        private readonly SymbologySettingsService _settings;
        public IBarcodeScanner? Engine { get; private set; }

        public string CurrentEngineName => Engine?.Name ?? "None";

        public event PropertyChangedEventHandler? PropertyChanged;

        public BarcodeScannerService(SymbologySettingsService settings)
        {
            _settings = settings;
        }

        public async Task InitializeAsync()
        {
            var native = new NativeBarcodeScanner();
            if (await native.InitializeAsync())
            {
                Engine = native;
            }
            else
            {
                var fallback = new FallbackBarcodeScanner();
                if (await fallback.InitializeAsync())
                {
                    Engine = fallback;
                }
            }

            if (Engine == null)
            {
                await ErrorService.ReportErrorAsync(Resources.Strings.NoDetectionEngine, true);
                return;
            }

            OnPropertyChanged(nameof(CurrentEngineName));
            await ApplySymbologiesAsync(_settings.GetEnabled());
        }

        public async Task ApplySymbologiesAsync(IEnumerable<BarcodeSymbology> symbologies)
        {
            if (Engine != null)
            {
                await Engine.ConfigureSymbologiesAsync(symbologies);
            }
        }

        private void OnPropertyChanged([CallerMemberName] string? name = null)
        {
            PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(name));
        }
    }
}
