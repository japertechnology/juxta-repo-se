using System;
using Windows.ApplicationModel.DataTransfer;

namespace JaperApp.Services
{
    /// <summary>
    /// Helper for safely writing to the clipboard.
    /// </summary>
    public static class ClipboardService
    {
        public static void SetText(string text)
        {
            try
            {
                var data = new DataPackage();
                data.SetText(text);
                Clipboard.SetContent(data);
            }
            catch (Exception)
            {
                ErrorService.ShowStatus(Resources.Strings.ClipboardBlocked);
            }
        }
    }
}
