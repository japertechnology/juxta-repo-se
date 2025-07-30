using System;
using System.Collections.Generic;
using System.Linq;

namespace JaperApp.Services
{
    public class SymbologySettingsService
    {
        private readonly SettingsService _settings;
        private readonly Dictionary<BarcodeSymbology, bool> _state =
            Enum.GetValues<BarcodeSymbology>().ToDictionary(s => s, _ => true);

        public SymbologySettingsService(SettingsService settings)
        {
            _settings = settings;
        }
        public IReadOnlyDictionary<BarcodeSymbology, bool> Symbologies => _state;

        public void Load()
        {
            var enabled = new HashSet<string>(_settings.Settings.EnabledSymbologies);
            foreach (var key in _state.Keys.ToList())
            {
                _state[key] = enabled.Contains(key.ToString());
            }
        }
        public void Save()
        {
            _settings.Settings.EnabledSymbologies = _state.Where(kv => kv.Value).Select(kv => kv.Key.ToString()).ToList();
            _settings.Save();
        }

        public IEnumerable<BarcodeSymbology> GetEnabled() => _state.Where(kv => kv.Value).Select(kv => kv.Key);

        public void SetEnabled(BarcodeSymbology symbology, bool enabled)
        {
            _state[symbology] = enabled;
        }
    }
}
