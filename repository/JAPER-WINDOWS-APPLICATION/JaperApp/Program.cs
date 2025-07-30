using Microsoft.UI.Xaml;

namespace JaperApp
{
    public static class Program
    {
        [System.STAThread]
        static void Main(string[] args)
        {
            Application.Start((p) => new App());
        }
    }
}
