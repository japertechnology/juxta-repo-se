using System.Linq;
using System.Xml.Linq;
using Xunit;

namespace JaperApp.Tests;

public class AccessibilityTests
{
    [Fact]
    public void Controls_HaveAutomationNames()
    {
        var xaml = XDocument.Load("../JaperApp/MainWindow.xaml");
        XNamespace x = "http://schemas.microsoft.com/winfx/2006/xaml";
        var controls = new[] { "DeviceComboBox", "ResolutionComboBox", "MirrorToggle", "TorchToggle", "ReconnectButton", "SettingsButton" };
        foreach (var name in controls)
        {
            var element = xaml.Descendants().FirstOrDefault(e => e.Attribute(x + "Name")?.Value == name);
            Assert.NotNull(element);
            var auto = element!.Attribute("AutomationProperties.Name");
            Assert.False(string.IsNullOrEmpty(auto?.Value));
        }
    }

    [Fact]
    public void ResultText_HasLiveSetting()
    {
        var xaml = XDocument.Load("../JaperApp/MainWindow.xaml");
        XNamespace x = "http://schemas.microsoft.com/winfx/2006/xaml";
        var result = xaml.Descendants().FirstOrDefault(e => e.Attribute(x + "Name")?.Value == "ResultText");
        Assert.NotNull(result);
        var live = result!.Attribute("AutomationProperties.LiveSetting");
        Assert.Equal("Polite", live?.Value);
    }
}
