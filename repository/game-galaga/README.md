# **Galaga (1981) — HTML/CSS/JavaScript recreation**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT) ![AI](https://img.shields.io/badge/Assisted-Development-2b2bff?logo=openai&logoColor=white) [![Node.js CI](https://github.com/japertechnology/game-galaga/actions/workflows/node.yml/badge.svg)](https://github.com/japertechnology/game-galaga/actions/workflows/node.yml)

Released by Namco in **1981** as the sequel to *Galaxian* and distributed by Midway in North America, *Galaga* perfected the fixed‑shooter with formation entries, aggressive dive attacks, and the iconic **tractor beam** that made the **Dual Fighter** possible. 
During development the team solved hardware sprite limits for the Dual Fighter by switching to **16×16 sprites** for ship and bullets—detail that shaped how the original plays and feels.
This repository aims to be a faithful, play‑in‑the‑browser rendition. You can slide left/right, fire **up to two shots on screen**, and optionally enable a rapid‑fire burst. Enemies stream in, settle into ranks of **Bosses, Guards, and Grunts**, and from **stage 1** you clear the convoy; from **stage 2** they also bomb during entry. Boss Galaga take **two hits**, can **capture** your fighter with a tractor beam, and a successful rescue while it dives reunites your ship into a **Dual Fighter**. Each stage fields **about 40 enemies**.

For a look back at the classic arcade games that inspired this project, see [HISTORY.md](HISTORY.md).

## Features
- Move the fighter left and right and fire up to two shots at a time with an optional rapid-fire burst.
- Bonus lives are awarded at 20,000 points and every 70,000 points thereafter.
- The score display rolls over after 999,990 points for Player 1 and uses a
  seven-digit readout for Player 2.
- Sprites and sound effects are loaded asynchronously on startup.
- Boss Galaga require two hits and change color after the first.
- Bosses can deploy a tractor beam to capture the fighter; the hostage stays red with the boss.
- Destroying the captor while it dives rescues the ship to form a Dual Fighter with double shots.
- Shooting the hostage instead awards points but loses the ship.
- Beginning at stage 4, a random enemy morphs into a special trio:
  Scorpions (stages 4–6, 1,000 pts), Bosconians (8–10, 2,000 pts) and
  Galaxians (12–14, 3,000 pts). The cycle repeats after stage 14.
- Scoring follows arcade values: Bees are worth 50 points in formation or 100 while diving, Butterflies 80/160, and Boss Galaga 150/400 with bonuses for escorts. Destroying a captured fighter yields 500 or 1,000 points, with extra bonuses for transform trios and Challenging Stages.
- Stages cycle through three regular waves followed by a Challenging Stage. Enemy speed and aggression rise slightly every stage.
- At stage 255 the game reacts to difficulty: Easy resets, Medium loops a special "Stage 0," Hard soft-locks, Hardest repeats at max difficulty.

## Installation

1. Install dependencies:

   ```bash
   npm install
   ```

## Running the game locally

Start a development server and open the game in your browser. The `start` script
uses `http-server` to serve `index.html` from the project root:

```bash
npm run start
```

## Linting and tests

Run ESLint to check code style (and any additional tests you may add) with:

```bash
npm run lint
```

Run Jest tests with:

```bash
npm test
```

## Packaging the game

Create a zip archive suitable for distribution using the `dist` script:

```bash
npm run dist
```
