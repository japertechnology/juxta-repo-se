using System;
using System.Threading.Tasks;
using Microsoft.UI.Xaml.Controls;
using JaperApp.Resources;

namespace JaperApp.Services
{
    /// <summary>
    /// Centralized helper for surfacing user facing error messages.
    /// </summary>
    public static class ErrorService
    {
        public static event EventHandler<string>? ErrorReported;

        public static void ShowStatus(string message)
        {
            ErrorReported?.Invoke(null, message);
        }

        public static async Task ShowDialogAsync(string message)
        {
            if (App.MainWindow?.Content?.XamlRoot == null)
            {
                ShowStatus(message);
                return;
            }

            var dialog = new ContentDialog
            {
                Title = Strings.ErrorDialogTitle,
                Content = message,
                CloseButtonText = "OK",
                XamlRoot = App.MainWindow.Content.XamlRoot
            };
            await dialog.ShowAsync();
        }

        public static async Task ReportErrorAsync(string message, bool useDialog)
        {
            if (useDialog)
                await ShowDialogAsync(message);
            else
                ShowStatus(message);
        }
    }
}
