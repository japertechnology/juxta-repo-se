using Microsoft.UI.Xaml;

namespace JaperApp.Services
{
    public static class ThemeService
    {
        public static void ApplyTheme(Window window, ThemePreference preference)
        {
            var theme = preference switch
            {
                ThemePreference.Dark => ElementTheme.Dark,
                ThemePreference.Light => ElementTheme.Light,
                _ => ElementTheme.Default
            };
            window.RequestedTheme = theme;
        }
    }
}
