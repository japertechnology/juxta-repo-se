using System;
using System.Globalization;
using Microsoft.UI.Xaml;
using JaperApp.Services;

namespace JaperApp
{
    public sealed partial class SettingsWindow : Window
    {
        private readonly SymbologySettingsService _settings;
        private readonly RoiSettingsService _roi;
        public event EventHandler? SettingsSaved;

        public SettingsWindow(SymbologySettingsService settings, RoiSettingsService roi)
        {
            this.InitializeComponent();
            _settings = settings;
            _roi = roi;
            ThemeService.ApplyTheme(this, App.Settings.Settings.Theme);
            this.Loaded += SettingsWindow_Loaded;
            SaveButton.Click += SaveButton_Click;
        }

        private void SettingsWindow_Loaded(object sender, RoutedEventArgs e)
        {
            QRCheckBox.IsChecked = _settings.Symbologies[BarcodeSymbology.QRCode];
            Code128CheckBox.IsChecked = _settings.Symbologies[BarcodeSymbology.Code128];
            Code39CheckBox.IsChecked = _settings.Symbologies[BarcodeSymbology.Code39];
            Ean13CheckBox.IsChecked = _settings.Symbologies[BarcodeSymbology.EAN13];
            Ean8CheckBox.IsChecked = _settings.Symbologies[BarcodeSymbology.EAN8];
            ItfCheckBox.IsChecked = _settings.Symbologies[BarcodeSymbology.ITF];
            DataMatrixCheckBox.IsChecked = _settings.Symbologies[BarcodeSymbology.DataMatrix];
            Pdf417CheckBox.IsChecked = _settings.Symbologies[BarcodeSymbology.PDF417];
            RoiLeftBox.Text = _roi.LeftPercent.ToString();
            RoiTopBox.Text = _roi.TopPercent.ToString();
            RoiWidthBox.Text = _roi.WidthPercent.ToString();
            RoiHeightBox.Text = _roi.HeightPercent.ToString();
            ThemeComboBox.SelectedIndex = (int)App.Settings.Settings.Theme;
        }

        private void SaveButton_Click(object sender, RoutedEventArgs e)
        {
            _settings.SetEnabled(BarcodeSymbology.QRCode, QRCheckBox.IsChecked ?? false);
            _settings.SetEnabled(BarcodeSymbology.Code128, Code128CheckBox.IsChecked ?? false);
            _settings.SetEnabled(BarcodeSymbology.Code39, Code39CheckBox.IsChecked ?? false);
            _settings.SetEnabled(BarcodeSymbology.EAN13, Ean13CheckBox.IsChecked ?? false);
            _settings.SetEnabled(BarcodeSymbology.EAN8, Ean8CheckBox.IsChecked ?? false);
            _settings.SetEnabled(BarcodeSymbology.ITF, ItfCheckBox.IsChecked ?? false);
            _settings.SetEnabled(BarcodeSymbology.DataMatrix, DataMatrixCheckBox.IsChecked ?? false);
            _settings.SetEnabled(BarcodeSymbology.PDF417, Pdf417CheckBox.IsChecked ?? false);
            _settings.Save();

            if (double.TryParse(RoiLeftBox.Text, NumberStyles.Float, CultureInfo.InvariantCulture, out var left))
                _roi.LeftPercent = left;
            if (double.TryParse(RoiTopBox.Text, NumberStyles.Float, CultureInfo.InvariantCulture, out var top))
                _roi.TopPercent = top;
            if (double.TryParse(RoiWidthBox.Text, NumberStyles.Float, CultureInfo.InvariantCulture, out var width))
                _roi.WidthPercent = width;
            if (double.TryParse(RoiHeightBox.Text, NumberStyles.Float, CultureInfo.InvariantCulture, out var height))
            _roi.HeightPercent = height;
            _roi.Save();

            if (ThemeComboBox.SelectedIndex >= 0)
            {
                App.Settings.Settings.Theme = (ThemePreference)ThemeComboBox.SelectedIndex;
                App.Settings.Save();
                if (App.MainWindow != null)
                {
                    ThemeService.ApplyTheme(App.MainWindow, App.Settings.Settings.Theme);
                }
            }

            SettingsSaved?.Invoke(this, EventArgs.Empty);
            this.Close();
        }
    }
}
