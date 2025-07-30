using Microsoft.UI.Xaml;
using System.IO;
using Windows.Storage;
using JaperApp.Services;

namespace JaperApp
{
    public partial class App : Application
    {
        public static OfflineQueueService? Queue { get; private set; }

        public static SettingsService Settings { get; private set; }
        public static Window? MainWindow { get; private set; }
        public App()
        {
            string path = Path.Combine(ApplicationData.Current.LocalFolder.Path, "queue.db");
            Queue = new OfflineQueueService(path);
            string settingsPath = Path.Combine(ApplicationData.Current.LocalFolder.Path, "settings.json");
            Settings = new SettingsService(settingsPath);
            Settings.Load();
        }

        protected override void OnLaunched(LaunchActivatedEventArgs args)
        {
            m_window = new MainWindow();
            MainWindow = m_window;
            ThemeService.ApplyTheme(m_window, Settings.Settings.Theme);
            m_window.Activate();
        }

        protected override void OnExiting(object sender, object e)
        {
            Settings.Save();
            Queue?.Dispose();
            base.OnExiting(sender, e);
        }

        private Window m_window;
    }
}
