using System.Resources;
using System.Globalization;

namespace JaperApp.Resources
{
    internal static class Strings
    {
        private static readonly ResourceManager _rm = new ResourceManager("JaperApp.Resources.Strings", typeof(Strings).Assembly);

        private static string Get(string name)
        {
            return _rm.GetString(name, CultureInfo.CurrentUICulture) ?? string.Empty;
        }

        public static string ErrorDialogTitle => Get(nameof(ErrorDialogTitle));
        public static string CameraPermissionDenied => Get(nameof(CameraPermissionDenied));
        public static string NoDetectionEngine => Get(nameof(NoDetectionEngine));
        public static string ClipboardBlocked => Get(nameof(ClipboardBlocked));
        public static string WebhookError(string detail) => string.Format(Get(nameof(WebhookError)), detail);
    }
}
