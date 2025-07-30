using System;
using System.Collections.Generic;
using System.IO;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace JaperApp.Services
{
    /// <summary>
    /// Simple JSON-backed settings service.
    /// </summary>
    public class SettingsService
    {
        private readonly string _filePath;

        public AppSettings Settings { get; private set; } = new AppSettings();

        public SettingsService(string filePath)
        {
            _filePath = filePath;
        }

        public void Load()
        {
            if (File.Exists(_filePath))
            {
                try
                {
                    var json = File.ReadAllText(_filePath);
                    var opts = new JsonSerializerOptions();
                    opts.Converters.Add(new JsonStringEnumConverter());
                    var data = JsonSerializer.Deserialize<AppSettings>(json, opts);
                    if (data != null)
                    {
                        Settings = data;
                    }
                }
                catch
                {
                    // ignore corrupt settings
                    Settings = new AppSettings();
                }
            }
        }

        public void Save()
        {
            Directory.CreateDirectory(Path.GetDirectoryName(_filePath)!);
            var opts = new JsonSerializerOptions { WriteIndented = true };
            opts.Converters.Add(new JsonStringEnumConverter());
            var json = JsonSerializer.Serialize(Settings, opts);
            File.WriteAllText(_filePath, json);
        }
    }

    public class AppSettings
    {
        public string? CameraDeviceId { get; set; }
        public List<string> EnabledSymbologies { get; set; } = new();
        public RoiConfig Roi { get; set; } = new();
        public List<string> OutputDestinations { get; set; } = new();
        public bool MirrorPreview { get; set; }
        public bool UseTorch { get; set; }
        public bool TelemetryEnabled { get; set; } = true;
        public bool FirstRunShown { get; set; }
        public ThemePreference Theme { get; set; } = ThemePreference.System;
    }

    public class RoiConfig
    {
        public double LeftPercent { get; set; } = 0;
        public double TopPercent { get; set; } = 0;
        public double WidthPercent { get; set; } = 100;
        public double HeightPercent { get; set; } = 100;
    }
}
