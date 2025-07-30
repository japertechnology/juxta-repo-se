# Assets

All assets must be uploaded manually.

The required image and sound files are described by accompanying JSON files:

- `player.png.json` – properties for the player sprite
- `enemy.png.json` – properties for a generic enemy sprite
- `boss.png.json` – properties for the boss enemy sprite
- `butterfly.png.json` – properties for the butterfly enemy sprite
- `bee.png.json` – properties for the bee enemy sprite
- `scorpion.png.json` – properties for the scorpion enemy sprite
- `bosconian.png.json` – properties for the bosconian enemy sprite
- `galaxian.png.json` – properties for the galaxian enemy sprite
- `bullet.png.json` – properties for the bullet sprite
- `shoot.wav.json` – properties for the firing sound effect
- `explosion.wav.json` – properties for explosion sounds
- `tractor.wav.json` – properties for the tractor beam effect
- `start.wav.json` – properties for the stage start music cue

## Animation Metadata

Image asset JSON files now include an optional `animation` object.  This
describes how many frames a sprite contains and the recommended playback
speed for simple animations.  A typical entry looks like:

```json
{
  "file": "player.png",
  "type": "image",
  "width": 16,
  "height": 16,
  "animation": {
    "frameCount": 2,
    "frameRate": 8
  }
}
```

`frameCount` is the number of frames contained in the sprite sheet (placed
horizontally) and `frameRate` indicates how many frames per second the game
should advance when rendering.

## Sprite frame data

Sprite descriptors store optional per-pixel information to document the
16×16 art. The `palette` section maps single‑character codes to CSS colors
and `frames` holds an array of 16 text lines for each animation frame.
Each character represents a pixel using the palette code. For example:

```json
{
  "file": "bullet.png",
  "type": "image",
  "width": 16,
  "height": 16,
  "animation": { "frameCount": 1, "frameRate": 0 },
  "frames": [[
    "0000000110000000",
    "0000000110000000",
    "1111111111111111",
    "1111111111111111",
    "0000000110000000",
    "0000000110000000",
    "0000000110000000",
    "0000000110000000",
    "0000000110000000",
    "0000000110000000",
    "0000000110000000",
    "0000000110000000",
    "0000000110000000",
    "0000000110000000",
    "0000000110000000",
    "0000000110000000"
  ]],
  "palette": { "0": "#000000", "1": "#FF0000" }
}
```

This format keeps the files compact and allows quick edits to the pixel
art while remaining human‑readable.
