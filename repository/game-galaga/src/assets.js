// -------------------------------------------------------------
// Asset Loading Helper
// -------------------------------------------------------------
//
// The real Galaga arcade board stored graphics and sound data in ROMs. This
// miniature clone instead pulls image and audio files at runtime.  The
// `loadAssets` function accepts a manifest mapping logical names to URLs and
// returns a Promise that resolves to an object of loaded resources.  Should a
// file fail to load (e.g. running from a local file system without the assets),
// we generate a small placeholder so the rest of the game can continue running
// without throwing errors.

export async function loadAssets(manifest) {
  // The manifest is a simple object where the key is the logical name used in
  // the game (e.g. 'player') and the value is the URL of the image or sound
  // file. We iterate that list, attempt to load each file, and return a new
  // object with the same keys mapped to the resulting HTMLImageElement or
  // HTMLAudioElement. Non-image/audio entries resolve to `null` so callers can
  // check for optional assets.
  const entries = await Promise.all(
    Object.entries(manifest).map(async ([key, url]) => {
      if (url.endsWith('.png')) {
        const img = await loadImage(url);
        return [key, img];
      }
      if (url.endsWith('.wav')) {
        const audio = await loadAudio(url);
        return [key, audio];
      }
      return [key, null];
    })
  );
  return Object.fromEntries(entries);
}

function loadImage(src) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => {
      // If the image fails to load we fabricate a small magenta square so
      // rendering code has something to draw and we can easily spot missing
      // art assets on screen. Setting `onload` to null prevents the placeholder
      // assignment from triggering the success handler a second time.
      const c = document.createElement('canvas');
      c.width = 16;
      c.height = 16;
      const ctx = c.getContext('2d');
      ctx.fillStyle = 'magenta';
      ctx.fillRect(0, 0, 16, 16);
      img.onload = null;
      img.onerror = null;
      img.src = c.toDataURL();
      resolve(img);
    };
    img.src = src;
  });
}

function loadAudio(src) {
  return new Promise((resolve) => {
    const audio = new Audio();
    // Resolve the promise once enough data is loaded to play.  If loading
    // fails (perhaps because the file is missing), we still resolve with the
    // audio element so callers can attempt to play it without additional checks.
    audio.onloadeddata = () => resolve(audio);
    audio.onerror = () => resolve(audio); // silent fallback
    audio.src = src;
  });
}

