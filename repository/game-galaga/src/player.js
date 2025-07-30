// -------------------------------------------------------------
// Player Fighter
// -------------------------------------------------------------
//
// The original arcade cabinet allowed the player to move left and right along
// the bottom of the screen, firing up to two shots at a time (or four when a
// "Dual Fighter" is formed).  This class encapsulates all of that behaviour:
// movement based on keyboard input, bullet management, score keeping and life
// tracking.
export class Player {
    constructor(x, y, assets = {}, isPlayer2 = false, cfg = {}) {
        // Initial position of the fighter at the start of a stage.
        this.x = x;
        this.y = y;
        // Remember the initial spawn position so we can reset the fighter
        // after losing a life without relying on hard-coded coordinates.
        this.startX = x;
        this.startY = y;
        // The sprites are tiny 16x16 images just like the arcade version.
        this.width = 16;
        this.height = 16;
        this.sprite = assets.player || null;
        this.isPlayer2 = isPlayer2;
        this.shootSound = assets.shoot || null;
        this.bulletSprite = assets.bullet || null;
        this.explosionSound = assets.explosion || null;
        this.rapidFire = cfg.rapidFire !== undefined ? cfg.rapidFire : true;
        // How many pixels the ship moves each frame when a key is held.
        this.speed = 3;
        // Active bullets fired by the player.
        this.bullets = [];
        // Countdown before the player can fire again.
        this.fireCooldown = 0;
        // Scoring and life tracking.
        // `score` is the displayed score which rolls over at 999,990.
        this.score = 0;
        // Tracks total points earned so we can award bonus lives even after
        // the display score rolls over.
        this.totalScore = 0;
        // Next score threshold that grants an extra life.
        this.nextLifeScore = cfg.bonusFirst || 20000;
        this.bonusEvery = cfg.bonusEvery === undefined ? 70000 : cfg.bonusEvery;
        this.lives = cfg.startingLives !== undefined ? cfg.startingLives : 3;
        this.dual = false;
        this.demo = cfg.demo || false;
        this.demoDir = 1;
    }

    // Called every frame by the engine to update the fighter state.
    update(delta, game) {
        this.handleInput(game);
        this.updateBullets();
        if (this.fireCooldown > 0) this.fireCooldown -= delta;
    }

    // Process key presses and move the fighter accordingly.
    handleInput(game) {
        if (this.demo) {
            this.x += this.demoDir * this.speed;
            if (this.x <= 0 || this.x >= game.width - this.width) {
                this.demoDir *= -1;
            }
            if (Math.random() < 0.1) this.fire();
        } else {
            const keys = Player.keys;
            if (keys['ArrowLeft']) this.x -= this.speed;
            if (keys['ArrowRight']) this.x += this.speed;
            this.x = Math.max(0, Math.min(game.width - this.width, this.x));
            if (keys['Space']) this.fire();
        }
    }

    // Spawn a new bullet if the player is allowed to shoot.
    fire() {
        const limit = this.dual ? 4 : 2; // Dual Fighter doubles the bullet cap
        if (this.fireCooldown > 0 || this.bullets.length >= limit) return;

        // Bullets spawn from the center of each fighter. With a Dual Fighter
        // there are two offsets so we fire from both ships simultaneously.
        const offsets = this.dual ? [2, this.width - 4] : [this.width / 2 - 1];
        for (const off of offsets) {
            if (this.bullets.length >= limit) break;
            this.bullets.push({ x: this.x + off, y: this.y });
        }
        // Rapid fire optionally spawns a second pair of bullets slightly behind
        // the first, mimicking the burst behaviour of the original cabinet.
        if (this.rapidFire) {
            for (const off of offsets) {
                if (this.bullets.length >= limit) break;
                this.bullets.push({ x: this.x + off, y: this.y - 8 });
            }
        }

        if (this.shootSound) {
            this.shootSound.currentTime = 0;
            this.shootSound.play();
        }

        this.fireCooldown = 200; // milliseconds between bursts
    }

    // Move all bullets upward and discard off-screen ones.
    updateBullets() {
        // Bullets travel straight upward at a fixed rate.  Once they leave the
        // top of the screen they are discarded to keep the array small.
        for (const b of this.bullets) {
            b.y -= 6;
        }
        this.bullets = this.bullets.filter(b => b.y > -10);
    }

    // Add to the player's score and handle bonus lives/rollover.
    gainScore(points) {
        this.totalScore += points;

        // Award extra lives according to configured bonus thresholds.
        // Bonus ships stop after one million points as in the arcade game.
        while (this.totalScore >= this.nextLifeScore && this.nextLifeScore <= 1000000) {
            this.lives += 1;
            this.nextLifeScore += this.bonusEvery > 0 ? this.bonusEvery : Infinity;
        }
        if (this.nextLifeScore > 1000000) {
            this.nextLifeScore = Infinity;
        }

        // The on-screen counter uses 6 digits for Player 1 and 7 for Player 2.
        // We simulate the arcade roll-over behaviour by modulo-ing the total
        // score accordingly.
        const rollOver = this.isPlayer2 ? 10000000 : 1000000;
        this.score = this.totalScore % rollOver;
    }

    // Return the score as a zero-padded string appropriate for the player.
    formattedScore() {
        const digits = this.isPlayer2 ? 7 : 6;
        return String(this.score).padStart(digits, '0');
    }

    // Remove a life and reset the fighter's position.
    loseLife() {
        if (!this.demo) this.lives -= 1;
        if (this.explosionSound) {
            this.explosionSound.currentTime = 0;
            this.explosionSound.play();
        }
        // Reset position to the initial spawn point. The ship also loses any
        // bullets on screen and reverts from Dual Fighter mode if active.
        this.x = this.startX;
        this.y = this.startY;
        this.bullets = [];
        this.dual = false;
        this.fireCooldown = 0;
    }

    // Draw the fighter and its bullets.
    render(ctx) {
        // Draw the fighter sprite if available; otherwise fall back to a simple
        // filled rectangle. When a Dual Fighter is active we render a second
        // ship slightly offset to the right.
        if (this.sprite && this.sprite.complete) {
            ctx.drawImage(this.sprite, this.x, this.y);
            if (this.dual) ctx.drawImage(this.sprite, this.x + this.width + 2, this.y);
        } else {
            ctx.fillStyle = 'white';
            ctx.fillRect(this.x, this.y, this.width, this.height);
            if (this.dual) ctx.fillRect(this.x + this.width + 2, this.y, this.width, this.height);
        }
        ctx.fillStyle = 'red';
        for (const b of this.bullets) {
            if (this.bulletSprite && this.bulletSprite.complete) {
                ctx.drawImage(this.bulletSprite, b.x - 7, b.y - 5);
            } else {
                ctx.fillRect(b.x, b.y, 2, 6);
            }
        }
    }
}

Player.keys = {};
// Simple keyboard state tracking for the arrow keys and spacebar. The main
// loop polls this object rather than relying on event-driven movement so that
// input remains deterministic across browsers.
window.addEventListener('keydown', e => { Player.keys[e.code] = true; });
window.addEventListener('keyup', e => { Player.keys[e.code] = false; });
