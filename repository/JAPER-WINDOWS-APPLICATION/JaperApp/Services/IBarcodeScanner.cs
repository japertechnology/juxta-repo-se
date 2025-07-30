using System.Collections.Generic;
namespace JaperApp.Services
{
    public interface IBarcodeScanner
    {
        /// <summary>
        /// Human readable name of the engine.
        /// </summary>
        string Name { get; }

        /// <summary>
        /// Initialize the engine.
        /// </summary>
        /// <returns>true if initialization succeeded.</returns>
        Task<bool> InitializeAsync();

        /// <summary>
        /// Limit decoding to the given symbologies.
        /// </summary>
        Task ConfigureSymbologiesAsync(IEnumerable<BarcodeSymbology> symbologies);

        /// <summary>
        /// Decode a frame represented by raw BGRA pixel data within the specified ROI.
        /// Returns the decoded text or null if none found.
        /// </summary>
        Task<string?> DecodeAsync(byte[] pixels, int width, int height, Windows.Foundation.Rect roi);
    }
}
