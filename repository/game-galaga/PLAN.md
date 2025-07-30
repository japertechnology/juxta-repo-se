# To recreate Galaga in its original, non-buggy form, you can break implementation into the following tasks. Features referenced below come from the design document (DESIGN.md).

## 1. Project & Core Engine Setup
- Choose a stack (e.g., HTML5 canvas or a small JS engine).
- Set up asset loading for sprites and sounds.
- Implement input for a two‑way stick (left/right) and a fire button. The original game restricts the player to two shots on screen and supports a rapid‑fire mode in bursts of two missiles.

## 2. Player Fighter
- Create the player sprite and movement logic on a single horizontal plane.
- Enforce the two‑shot limit and rapid-fire bursts as above.
- Track player lives and bonus life thresholds (default 20,000 points and every 70,000 thereafter).
- Handle score rollover at 999,990 for Player 1 (seven digits for Player 2).

## 3. Enemy Formation & Wave Logic
- Design formation entry from the top/sides, settling into formation. Starting at stage 2, enemies drop bombs during entry.
- Build rows of Boss Galaga, Butterflies, and Bees (about 40 enemies per stage).
- Limit on-screen bee bullets to eight to avoid the classic “no‑fire” bug, ensuring bullets always despawn cleanly.

## 4. Enemy Attacks
- Implement attack waves in singles, pairs, or trios that weave, loop, and attempt to ram the player.
- Handle bombs and collisions with the player, subtracting a life and resetting the fighter.

## 5. Boss Galaga Capture Mechanics
- Boss Galaga takes two hits (color change on first hit).
- Implement tractor-beam capture: the captured ship turns red and parks at the top.
- If the player destroys the captor while it dives/attacks, the captured ship joins to create a Dual Fighter with double firepower; accidentally shooting the captured ship destroys it for 500–1000 points.
- Ensure bosses do not attempt capture when only one remains (for later stages).

## 6. Transform Enemies
- Starting at stage 4, implement periodic transformations:
- Stages 4–6: Scorpion trio worth 1,000 points.
- Stages 8–10: Bosconian trio worth 2,000 points.
- Stages 12–14: Galaxian trio worth 3,000 points.
- After stage 14, these cycles repeat.

## 7. Challenging Stages
- After stage 2, the first Challenging Stage appears on stage 3. Subsequent Challenging Stages occur every four stages (7, 11, 15, …) with 40 preset enemies that do not fire.
- Award 100 points per hit plus bonuses for clearing complete groups and a perfect 10,000‑point bonus for all 40 hits.

## 8. Scoring System
- Implement scoring based on formation vs. in-flight kills:
- Bees: 50 / 100
- Butterflies: 80 / 160
- Boss Galaga: 150 / 400 (plus escort bonuses)
- Captured fighter destroyed: 500 / 1,000
- Include transform and Challenging Stage bonuses.

## 9. Stage Flow & Difficulty
- Normal stage sequence: three regular stages → Challenging Stage → repeat.
- Gradually increase enemy speed, shot frequency, and attack aggressiveness as stages progress.
- Implement Stage 255 kill-screen behaviors for different difficulty settings (Easy resets, Medium loops “Stage 0,” Hard/Hardest soft-lock or loop).

## 10. DIP/Operator Options
- Provide configuration options mirroring the arcade DIP switches: difficulty level (A–D), starting fighters, bonus thresholds, sound during attract mode, etc. Include the ability to enable/disable rapid fire and run a self-test with sound samples, as described in the manual.

## 11. Visual & Sound Assets
- Use 16×16 sprites for ships and bullets, matching the original’s workaround for Dual Fighter bullet budget.
- Recreate classic Galaga sounds (shooting, explosions, tractor beam, stage start) and music cues.

## 12. Additional Details & Polish
- Implement the “Perfect!! Number of Hits 40” message after clearing Challenging Stages perfectly.
- Show the attract/demo sequence and optional sound playback during attract mode.
- Ensure enemies never stop firing due to bullet-slot corruption, preventing the “no-fire bug” from occurring even if only two left Bees remain (it’s a bug to avoid).
- Include Player 2 support with 7-digit score display as a nod to high-level play.
