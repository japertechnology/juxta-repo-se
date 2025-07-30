using System;
using System.Text.Json;

namespace JaperApp.Services
{
    /// <summary>
    /// Simple helper for sending telemetry events respecting user settings.
    /// </summary>
    public static class TelemetryService
    {
        private const string Endpoint = "https://example.com/telemetry";

        public static void LogEvent(string eventName)
        {
            if (!App.Settings.Settings.TelemetryEnabled || App.Queue == null)
                return;

            var payload = JsonSerializer.Serialize(new
            {
                Name = eventName,
                Timestamp = DateTimeOffset.UtcNow
            });

            App.Queue.Enqueue(Endpoint, payload, isWebSocket: false);
        }
    }
}
