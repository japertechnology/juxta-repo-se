using System;
using System.Globalization;
using Windows.Foundation;

namespace JaperApp.Services
{
    /// <summary>
    /// Stores region-of-interest percentages for frame cropping.
    /// </summary>
    public class RoiSettingsService
    {
        private readonly SettingsService _settings;

        public double LeftPercent { get; set; } = 0;
        public double TopPercent { get; set; } = 0;
        public double WidthPercent { get; set; } = 100;
        public double HeightPercent { get; set; } = 100;

        public RoiSettingsService(SettingsService settings)
        {
            _settings = settings;
        }

        public void Load()
        {
            var roi = _settings.Settings.Roi;
            LeftPercent = roi.LeftPercent;
            TopPercent = roi.TopPercent;
            WidthPercent = roi.WidthPercent;
            HeightPercent = roi.HeightPercent;
        }

        public void Save()
        {
            var roi = _settings.Settings.Roi;
            roi.LeftPercent = LeftPercent;
            roi.TopPercent = TopPercent;
            roi.WidthPercent = WidthPercent;
            roi.HeightPercent = HeightPercent;
            _settings.Save();
        }

        public Rect CalculatePixelRect(int frameWidth, int frameHeight)
        {
            double left = Math.Clamp(LeftPercent, 0, 100);
            double top = Math.Clamp(TopPercent, 0, 100);
            double width = Math.Clamp(WidthPercent, 0, 100);
            double height = Math.Clamp(HeightPercent, 0, 100);

            double x = Math.Clamp(frameWidth * left / 100.0, 0, frameWidth);
            double y = Math.Clamp(frameHeight * top / 100.0, 0, frameHeight);
            double w = Math.Clamp(frameWidth * width / 100.0, 0, frameWidth - x);
            double h = Math.Clamp(frameHeight * height / 100.0, 0, frameHeight - y);

            return new Rect(x, y, w, h);
        }
    }
}
