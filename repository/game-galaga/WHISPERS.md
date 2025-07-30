# Whipsers

### Core play & controls

* **Fixed shooter**: move a fighter left/right with a 2‑way stick and fire; clear every wave by destroying all enemies. ([Wikipedia][1])
* **Shots**: the arcade game allows **up to 2 of your shots on screen**; holding fire uses an operator‑selectable **rapid (auto) fire** that shoots in **bursts of two missiles**. ([galaga.com][2])
* **Formation entry**: enemies stream in from the top/sides, then settle into formation; from **stage 2 onward they drop bombs while entering** (stage 1 doesn’t). ([gamesdatabase.org][3])
* **Enemy ranks in formation (top → bottom)**: **Boss Galaga** (flagships), **Butterflies**, **Bees**. Attacks then come in 1s/2s/3s that weave, loop, and try to ram. ([gamesdatabase.org][3])
* **Wave size**: about **40 enemies per stage**. ([galaga.com][2])

### Enemy fire & important limits

* Enemies use limited “bullet slots”: the code permits **8 bee shots on screen max**. (This underpins the famous “no‑fire” bug below.) ([computerarcheology.com][4])

### Boss Galaga, capture & Dual Fighter

* **Boss Galaga take two hits**: first hit turns them green→blue; second destroys.&#x20;
* **Tractor beam**: a boss can capture your ship; the captured ship turns red and parks with that boss at the top. ([gamesdatabase.org][3])
* **Rescue for Dual Fighter**: shoot the **captor** while it **dives/attacks** to free the ship; it docks to create a **Dual Fighter** that fires from both ships (bigger hitbox, much higher damage). ([galaga.com][2])
* **Don’t shoot the hostage**: if you hit your captured ship, it’s lost—worth **500 pts** if it was parked in formation, **1000 pts** if it was attacking. ([gamesdatabase.org][3])
* Strategy notes from a top player: bosses **won’t attempt capture when only one boss remains**; center‑screen Dual Fighter helps perfect early Challenging Stages; difficulty growth **tops out around stage 31**. ([Set Side B][5])

### Transforms (bonus trios during regular stages)

Beginning with **stage 4**, a Bee (or Butterfly) morphs once per stage into a trio of special enemies. Destroy all 3 for a stage‑dependent bonus:

* **Stages 4–6:** Scorpions – **+1,000 pts** for the trio.
* **Stages 8–10:** Bosconian spy ships – **+2,000 pts**.
* **Stages 12–14:** Galaxian flagships – **+3,000 pts**.
  After 14, the three sets **repeat in that order**. ([gamesdatabase.org][3])

### Challenging Stages

* Appear after **stage 2** with the first on **stage 3**, then every four stages thereafter (**7, 11, 15, …**). Enemies (total **40**) fly preset paths and **don’t fire**.
* **Scoring**: 100 pts per ship; destroy a complete group of 8 to earn extra bonus that scales by appearance (**1,000 / 1,000 / 1,500 / 1,500 / 2,000 / 2,000 / 3,000+** thereafter); **Perfect (all 40)** adds **10,000 pts** and flashes **“PERFECT!!  NUMBER OF HITS 40”**. ([gamesdatabase.org][3])

### Scoring values (regular play)

* **Bee (blue/yellow)**: **50** in formation / **100** in flight.
* **Butterfly (red/white)**: **80** / **160**.
* **Boss Galaga (no escorts)**: **150** / **400**; with **1 escort**: **800**; with **2 escorts**: **1,600**.
* **Captured fighter destroyed**: **500** in formation / **1,000** in flight (as above).
* Transform trio bonuses as listed; Challenging Stage bonuses as above. ([gamesdatabase.org][3], [Retro Games Tips][6])

### Lives, extra men, score display

* **Default starting lives**: **3** (operator‑selectable: 2/3/4/5). **Bonus ships** default at **20,000** then **every 70,000** (DIP‑selectable).&#x20;
* **After 1,000,000 points** no further bonus ships are awarded. ([gamesdatabase.org][3])
* **Score roll‑over**: P1 shows 6 digits (rolls at 999,990); P2 shows **7 digits**, so high‑level players often play on **Player 2**. ([gamesdatabase.org][3], [Set Side B][5])

### Stage flow, difficulty & kill screens

* Pattern: three regular stages → **Challenging Stage** → repeat. Enemies become faster, shoot more, and use tighter rams as stages advance.&#x20;
* **Kill‑screen/Stage 255 behavior depends on DIP difficulty**:

  * **Easy**: resets.
  * **Medium**: shows **“Stage 0”**, a hybrid of the 2nd Challenging Stage where enemies **do shoot**; then loops.
  * **Hard**: locks on “Stage 0” with no enemies (soft‑lock).
  * **Hardest**: “Stage 0” plays like Stage 1 but at Stage‑255 difficulty, then loops. ([gamesdatabase.org][3], [StrategyWiki][7])

### Known bugs, tricks & competitive rules

* **No‑fire bug (“two left bees”)**: Leave 1–2 **leftmost Bees** alive on stage 1 (or 2) and dodge their shots \~15 minutes. Their bullets eventually corrupt all **8 enemy bullet slots**, and **enemies stop firing for the rest of the game**. Twin Galaxies‑style rules treat intentional exploitation as **not allowed**; casual players can still encounter it incidentally. ([gamesdatabase.org][3], [computerarcheology.com][4], [Set Side B][5])
* **200% hit rate novelty**: with precise timing, the first shot can kill two enemies at once; then immediately lose remaining ships to end with **200%** on the results screen. (For fun—no gameplay benefit.) ([gamesdatabase.org][3])
* **Demo‑mode control bug**: during the attract demo’s tractor beam, players can sometimes take control briefly, causing odd states before the score screen. ([gamesdatabase.org][3])

### Operator / DIP options (arcade cabinet)

* **Difficulty ranks A–D** (A easiest, D hardest).&#x20;
* **Starting fighters**: 2/3/4/5; **bonus ship thresholds** (default **20,000** & **every 70,000**); **sound in attract** on/off; **freeze video** test; **automatic rack advance** (for service); coin counter modes.&#x20;
* The manual also details **rapid fire enable/disable** and a **Self‑Test** page that lists the current DIP settings, RAM/ROM checks, and lets you audition **18 sounds**.&#x20;
* Cocktail cabinets flip the picture to face the current player during alternating turns.&#x20;

### Development tidbits that affect gameplay

* The **Dual Fighter** originally had sprite‑count issues that prevented extra bullets; the team solved it by using **16×16 sprites for ship and bullets** to free sprite budget. ([Wikipedia][1])

---

**Sources**

* Midway **Galaga Parts & Operating Manual** (Oct. 1981): gameplay description, capture rules & points, Challenging Stage rules/bonuses, DIP options, self‑test.&#x20;
* **Bandai Namco official Galaga site**: 40‑unit formation, 2‑shot limit, enemy types, capture → Dual Fighter summary. ([galaga.com][2])
* **GamesDatabase (MAME ROM information)**: full scoring table; transform cycles; first‑stage no bombs; roll‑over, million‑point bonus stop; kill‑screen behaviors; tips. ([gamesdatabase.org][3])
* **StrategyWiki**: comprehensive walkthrough; transform sequencing; kill‑screen notes; no‑fire trick method. ([StrategyWiki][7], [StrategyWiki][8])
* **Computer Archeology**: technical analysis proving **8 enemy bullet slots** and explaining the **no‑fire bug** cause (bullets spawned at X=0 never freed). ([computerarcheology.com][4])
* **Set Side B** (summarizing pro player Jordan Dorrington): capture behavior tips, stage pattern, difficulty cap, looping notes, and competitive stance on the no‑fire bug. ([Set Side B][5])
* **Wikipedia**: development details on Dual Fighter sprite workaround and general gameplay summary. ([Wikipedia][1])
* **Retrogames / tips**: corroborating scoring values and perfect‑bonus counts. ([Retro Games Tips][6])

If you’d like, I can turn this into a printable reference card (scoring table + DIP defaults + transform schedule).

[1]: https://en.wikipedia.org/wiki/Galaga "Galaga - Wikipedia"
[2]: https://galaga.com/en/history/galaga.php "Galaga Web | BANDAI NAMCO Entertainment Inc."
[3]: https://www.gamesdatabase.org/mame-rom/galaga "
	galaga (MAME ROM Information)
"
[4]: https://www.computerarcheology.com/Arcade/Galaga/ "Galaga"
[5]: https://setsideb.com/jordan-dorringtons-galaga-strategy-tips/ "Jordan Dorrington’s Galaga Strategy Tips – Set Side B"
[6]: https://tips.retrogames.com/gamepage/galaga.html?utm_source=chatgpt.com "GALAGA - Retrogames"
[7]: https://strategywiki.org/wiki/Galaga/Walkthrough "Galaga/Walkthrough — StrategyWiki | Strategy guide and game reference wiki"
[8]: https://strategywiki.org/wiki/Galaga/Walkthrough?utm_source=chatgpt.com "Galaga/Walkthrough — StrategyWiki | Strategy guide and game reference wiki"
