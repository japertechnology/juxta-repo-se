import { Player } from './player.js';

// -------------------------------------------------------------
// Enemy Ship and Behaviour
// -------------------------------------------------------------
//
// Each enemy represents one of the classic Galaga foes (Boss, Butterfly or
// Bee).  Enemies enter the screen, form a grid, then periodically break from
// formation to attack the player. Bosses may attempt to capture the player's
// fighter using a tractor beam. This file handles both the per-enemy logic and
// a manager class that spawns waves and orchestrates attacks.
export class Enemy {
    constructor(spawnX, spawnY, targetX, targetY, type, sprite, bulletSprite, dropDuringEntry, challenge = false, vx = 0, vy = 0, group = 0) {
        // Spawn position is off-screen. The enemy will travel to (targetX,
        // targetY) to join the formation.
        this.x = spawnX;
        this.y = spawnY;
        this.targetX = targetX;
        this.targetY = targetY;
        this.type = type; // 'boss', 'butterfly', 'bee', plus special trio types
        this.sprite = sprite;
        this.bulletSprite = bulletSprite;
        // From stage 2 onward enemies drop bombs while entering.
        this.dropDuringEntry = dropDuringEntry;

        this.width = 16;
        this.height = 16;
        this.speed = 2;
        this.inFormation = false;
        this.attacking = false;
        this.attackAngle = 0;
        this.attackPhase = 'none';
        this.bullets = [];
        this.fireCooldown = 1000 + Math.random() * 1000;

        this.hitPoints = type === 'boss' ? 2 : 1;
        this.capturedShip = null; // holds a captured player fighter
        this.willCapture = false;
        this.captureTimer = 0;
        this.trio = null; // reference to trio info if part of a bonus group

        // Challenging Stage behaviour flags
        this.challenge = challenge;
        this.vx = vx;
        this.vy = vy;
        this.group = group;
    }

    updateAttack(delta, game, manager, player) {
        // During an attack the enemy moves through several phases. `loop` is a
        // downward arc/loop-the-loop motion, optionally followed by a tractor
        // beam capture attempt, then a diving attack toward the player and
        // finally a return to formation.
        const loopSpeed = 0.002 * delta;
        if (this.attackPhase === 'loop') {
            // Circle downwards in front of the formation. Once a full loop is
            // complete decide whether to attempt a capture or dive straight at
            // the player.
            this.attackAngle += loopSpeed;
            const radiusX = 40;
            const radiusY = 60;
            this.x = this.baseX + Math.sin(this.attackAngle) * radiusX;
            this.y = this.baseY + (1 - Math.cos(this.attackAngle)) * radiusY;
            this.tryFire(delta, game, manager);
            if (this.attackAngle >= Math.PI * 2) {
                this.attackPhase = this.willCapture ? 'capture' : 'dive';
                if (this.attackPhase === 'capture') manager.startTractor();
            }
        } else if (this.attackPhase === 'capture') {
            // Bosses slowly descend while emitting a tractor beam. If the
            // player is caught the fighter becomes a red captive attached to
            // this enemy.
            this.captureTimer += delta;
            this.y += this.speed * 0.5;
            if (player && rectsIntersect({ x: this.x, y: this.y + this.height, width: this.width, height: game.height }, player)) {
                player.loseLife();
                this.capturedShip = { x: this.x, y: this.y - 18 };
                this.attackPhase = 'return';
                manager.stopTractor();
            }
            // After a few seconds give up and dive instead.
            if (this.captureTimer > 3000) {
                this.attackPhase = 'dive';
                manager.stopTractor();
            }
        } else if (this.attackPhase === 'dive') {
            // Standard kamikaze dive toward the player. If no player entity
            // exists (e.g. between lives) the enemy simply exits the bottom of
            // the screen.
            const target = player || { x: this.baseX, y: game.height + 40 };
            const dx = target.x - this.x;
            const dy = target.y - this.y;
            const dist = Math.hypot(dx, dy);
            if (dist > 0) {
                const step = this.speed * 1.5;
                this.x += step * dx / dist;
                this.y += step * dy / dist;
            }
            this.tryFire(delta, game, manager);
            if (this.y > game.height + 20) {
                this.attacking = false;
                this.inFormation = true;
                this.x = this.targetX;
                this.y = this.targetY;
                this.willCapture = false;
                this.captureTimer = 0;
            }
        } else if (this.attackPhase === 'return') {
            // Move directly back to the formation slot.
            const dx = this.targetX - this.x;
            const dy = this.targetY - this.y;
            const dist = Math.hypot(dx, dy);
            if (dist > 0) {
                const step = this.speed;
                this.x += step * dx / dist;
                this.y += step * dy / dist;
            } else {
                this.x = this.targetX;
                this.y = this.targetY;
                this.attacking = false;
                this.inFormation = true;
                this.attackPhase = 'none';
            }
        }
    }

    startAttack(capture = false) {
        // Called by the EnemyManager to send this enemy out of formation.
        if (this.attacking || !this.inFormation) return;
        this.attacking = true;
        this.inFormation = false;
        this.attackAngle = 0;
        this.attackPhase = 'loop';
        this.baseX = this.x;
        this.baseY = this.y;
        // Only bosses can capture and only when requested by the manager.
        this.willCapture = capture && this.type === 'boss';
    }

    // Move toward the formation spot or perform an attack.
    update(delta, game, manager, player) {
        if (this.challenge) {
            // Simple movement for Challenging Stage enemies.
            this.x += this.vx;
            this.y += this.vy;
            return;
        }
        if (this.attacking) {
            this.updateAttack(delta, game, manager, player);
        } else if (!this.inFormation) {
            // Move toward the assigned grid position during the entry phase.
            const dx = this.targetX - this.x;
            const dy = this.targetY - this.y;
            const dist = Math.hypot(dx, dy);
            const step = this.speed;
            if (dist > step) {
                this.x += step * dx / dist;
                this.y += step * dy / dist;
            } else {
                this.x = this.targetX;
                this.y = this.targetY;
                this.inFormation = true;
            }
            if (this.dropDuringEntry) {
                // From stage 2 onward enemies can shoot while entering.
                this.tryFire(delta, game, manager);
            } else {
                this.fireCooldown -= delta;
            }
        } else {
            // When in formation and not currently attacking, occasionally fire
            // straight downward at the player.
            this.tryFire(delta, game, manager);
        }

        // Enemy bullets travel downward until leaving the screen.
        for (const b of this.bullets) {
            if (!b.active) continue;
            b.y += 3;
            if (b.y >= game.height + 10) b.active = false;
        }
        this.bullets = this.bullets.filter(b => b.active);

        if (this.capturedShip) {
            // Keep the captured fighter attached just above the boss.
            this.capturedShip.x = this.x;
            this.capturedShip.y = this.y - 18;
        }
    }

    tryFire(delta, game, manager) {
        // Fire a single bullet if the cooldown has elapsed. Bees share a global
        // bullet limit to mimic the original hardware's restrictions.
        if (this.challenge) return;
        this.fireCooldown -= delta;
        if (this.fireCooldown > 0) return;
        if (this.type === 'bee' && manager.beeBulletCount() >= manager.beeBulletLimit) {
            this.fireCooldown = 200; // small delay before trying again
            return;
        }
        this.bullets.push({ x: this.x + this.width / 2 - 1, y: this.y + this.height, active: true });
        this.fireCooldown = 1000 + Math.random() * 1000;
    }

    takeHit() {
        // Returns true when the enemy should be removed. Bosses require two
        // hits; all others are destroyed in one.
        this.hitPoints -= 1;
        if (this.type === 'boss' && this.hitPoints === 1) {
            // color will change via render()
        }
        return this.hitPoints <= 0;
    }

    render(ctx) {
        // Render the enemy sprite if loaded; otherwise use a coloured square
        // that indicates type and boss damage state.
        if (this.sprite && this.sprite.complete) {
            ctx.drawImage(this.sprite, this.x, this.y);
        } else {
            if (this.type === 'boss') {
                ctx.fillStyle = this.hitPoints === 2 ? 'orange' : 'blue';
            } else if (this.type === 'butterfly') {
                ctx.fillStyle = 'red';
            } else if (this.type === 'scorpion') {
                ctx.fillStyle = 'purple';
            } else if (this.type === 'bosconian') {
                ctx.fillStyle = 'pink';
            } else if (this.type === 'galaxian') {
                ctx.fillStyle = 'cyan';
            } else {
                ctx.fillStyle = 'yellow';
            }
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
        ctx.fillStyle = 'lime';
        for (const b of this.bullets) {
            if (this.bulletSprite && this.bulletSprite.complete) {
                ctx.drawImage(this.bulletSprite, b.x - 7, b.y - 5);
            } else {
                ctx.fillRect(b.x, b.y, 2, 6);
            }
        }

        if (this.attackPhase === 'capture') {
            // Draw the tractor beam area while a boss is attempting a capture.
            ctx.fillStyle = 'rgba(0,255,255,0.5)';
            ctx.fillRect(this.x, this.y + this.height, this.width, 200);
        }
        if (this.capturedShip) {
            ctx.fillStyle = 'red';
            ctx.fillRect(this.capturedShip.x, this.capturedShip.y, 16, 16);
        }
    }
}

export class EnemyManager {
    constructor(assets = {}, difficulty = 'easy') {
        // Shared sprite used by all enemies when drawing. Storing it here saves
        // memory compared to each enemy holding its own copy.
        this.sprite = assets.enemy || null;
        this.bulletSprite = assets.bullet || null;
        this.explosionSound = assets.explosion || null;
        this.tractorSound = assets.tractor || null;
        this.startSound = assets.start || null;
        this.enemies = [];
        this.stage = 1;
        this.difficulty = difficulty;
        this.loopStageZero = false;
        this.loopStage255 = false;
        this.softLock = false;
        // Bees are limited to a fixed number of active bullets to reproduce the
        // arcade game's hardware constraint.
        this.beeBulletLimit = 8;
        this.attackCooldown = 2000;

        // Challenging Stage tracking
        this.challengeStage = false;
        this.challengeGroups = [];
        this.challengeRemaining = 0;
        this.challengePerfect = false;
        this.perfectTimer = 0;
    }

    startTractor() {
        if (this.tractorSound) {
            this.tractorSound.currentTime = 0;
            this.tractorSound.loop = true;
            this.tractorSound.play();
        }
    }

    stopTractor() {
        if (this.tractorSound) {
            this.tractorSound.pause();
            this.tractorSound.currentTime = 0;
            this.tractorSound.loop = false;
        }
    }

    difficultyMultiplier() {
        return 1 + Math.max(0, this.stage - 1) * 0.05;
    }

    bossCount() {
        return this.enemies.filter(e => e.type === 'boss').length;
    }

    beeBulletCount() {
        return this.enemies
            .filter(e => e.type === 'bee')
            .reduce((sum, e) => sum + e.bullets.filter(b => b.active).length, 0);
    }

    trioTypeForStage(stage) {
        const cycle = stage - 4;
        if (cycle < 0) return null;
        const mod = cycle % 12;
        if (mod >= 0 && mod <= 2) return 'scorpion';
        if (mod >= 4 && mod <= 6) return 'bosconian';
        if (mod >= 8 && mod <= 10) return 'galaxian';
        return null;
    }

    spawnTrio(game, type) {
        const points = type === 'scorpion' ? 1000 : type === 'bosconian' ? 2000 : 3000;
        const info = { remaining: 3, points };
        const startX = game.width / 2 - 40;
        for (let i = 0; i < 3; i++) {
            const x = startX + i * 40;
            const enemy = new Enemy(x, -20, x, 60, type, this.sprite, this.bulletSprite, this.stage >= 2);
            enemy.attacking = true;
            enemy.attackPhase = 'dive';
            enemy.baseX = x;
            enemy.baseY = -20;
            enemy.trio = info;
            this.enemies.push(enemy);
        }
    }

    spawnRegularStage(game) {
        // Populate a new wave of enemies in a 10x4 grid roughly matching the
        // classic formation. Spawn positions start off-screen so enemies can
        // fly in from the sides or top before settling into place.
        this.enemies = [];
        const cols = 10;
        const spacingX = 40;
        const spacingY = 30;
        const startX = (game.width - (cols - 1) * spacingX) / 2;
        const startY = 40;
        const types = [];
        for (let i = 0; i < 10; i++) types.push('boss');
        for (let i = 0; i < 10; i++) types.push('butterfly');
        for (let i = 0; i < 20; i++) types.push('bee');
        const diff = this.difficultyMultiplier();
        types.forEach((t, idx) => {
            const row = Math.floor(idx / cols);
            const col = idx % cols;
            const targetX = startX + col * spacingX;
            const targetY = startY + row * spacingY;
            // Randomly choose whether the enemy enters from the top or either
            // side of the screen. This gives each stage a bit of variety while
            // ultimately settling into the same grid.
            const spawnType = Math.random();
            let sx, sy;
            if (spawnType < 0.33) {
                sx = targetX;
                sy = -20;
            } else if (spawnType < 0.66) {
                sx = -20;
                sy = targetY;
            } else {
                sx = game.width + 20;
                sy = targetY;
            }
            const enemy = new Enemy(sx, sy, targetX, targetY, t, this.sprite, this.bulletSprite, this.stage >= 2);
            enemy.speed *= diff;
            enemy.fireCooldown /= diff;
            this.enemies.push(enemy);
        });

        const trio = this.trioTypeForStage(this.stage);
        if (trio) {
            this.spawnTrio(game, trio);
        }
    }

    spawnChallengingStage(game) {
        this.challengeStage = true;
        this.challengeGroups = Array.from({ length: 5 }, () => ({ remaining: 8 }));
        this.challengeRemaining = 40;
        this.challengePerfect = false;
        this.perfectTimer = 0;
        this.enemies = [];

        // Simple predetermined patterns: groups fly straight across or down.
        const diff = this.difficultyMultiplier();
        const speed = 1.5 * diff;
        for (let i = 0; i < 8; i++) {
            const y = 60 + i * 20;
            this.enemies.push(new Enemy(-30 - i * 20, y, 0, 0, 'bee', this.sprite, this.bulletSprite, false, true, speed, 0, 0));
            const y2 = 260 + i * 20;
            this.enemies.push(new Enemy(-30 - i * 20, y2, 0, 0, 'bee', this.sprite, this.bulletSprite, false, true, speed, 0, 2));
            this.enemies.push(new Enemy(game.width + 30 + i * 20, y, 0, 0, 'bee', this.sprite, this.bulletSprite, false, true, -speed, 0, 1));
            this.enemies.push(new Enemy(game.width + 30 + i * 20, y2, 0, 0, 'bee', this.sprite, this.bulletSprite, false, true, -speed, 0, 3));
            const x = 50 + i * 40;
            this.enemies.push(new Enemy(x, -30 - i * 20, 0, 0, 'bee', this.sprite, this.bulletSprite, false, true, 0, speed, 4));
        }
    }

    startNextStage(game) {
        this.challengeStage = false;
        this.attackCooldown = (2000 + Math.random() * 2000) / this.difficultyMultiplier();
        if (this.startSound) {
            this.startSound.currentTime = 0;
            this.startSound.play();
        }
        if (this.isChallengingStage(this.stage)) {
            this.spawnChallengingStage(game);
        } else {
            this.spawnRegularStage(game);
        }
    }

    isChallengingStage(n) {
        // The first Challenging Stage occurs after stage 2 (stage 3). Afterward
        // they repeat every four stages. Stage 255 is a special kill screen and
        // not considered a Challenging Stage.
        return n >= 3 && (n - 3) % 4 === 0 && n !== 255;
    }

    handleStage255(game) {
        if (this.difficulty === 'easy') {
            this.stage = 1;
            this.startNextStage(game);
            this.stage += 1;
        } else if (this.difficulty === 'medium') {
            this.loopStageZero = true;
            this.stage = 0;
            this.startNextStage(game);
            this.stage = 0;
        } else if (this.difficulty === 'hard') {
            this.softLock = true;
            this.stage = 0;
            this.enemies = [];
        } else {
            this.loopStage255 = true;
            this.stage = 255;
            this.startNextStage(game);
            this.stage = 255;
        }
    }

    update(delta, game) {
        const player = game.entities.find(ent => ent instanceof Player);
        if (this.enemies.length === 0) {
            if (this.challengePerfect && this.perfectTimer > 0) {
                this.perfectTimer -= delta;
                if (this.perfectTimer <= 0) {
                    const msg = document.getElementById('message');
                    if (msg) msg.style.display = 'none';
                } else {
                    return;
                }
            }
            this.challengePerfect = false;
            if (this.softLock) return;
            if (this.stage === 256) {
                this.handleStage255(game);
            } else if (this.loopStageZero) {
                this.stage = 0;
                this.startNextStage(game);
                this.stage = 0;
            } else if (this.loopStage255) {
                this.stage = 255;
                this.startNextStage(game);
                this.stage = 255;
            } else {
                // Start the next stage when all enemies are gone.
                this.startNextStage(game);
                this.stage += 1;
            }
        }

        // Periodically pick a few enemies from the formation to break off and
        // attack the player during regular stages.
        if (!this.challengeStage) {
            this.attackCooldown -= delta;
            if (this.attackCooldown <= 0) {
                const available = this.enemies.filter(en => en.inFormation && !en.attacking);
                if (available.length > 0) {
                    const diff = this.difficultyMultiplier();
                    const count = Math.min(available.length, 1 + Math.floor(Math.random() * diff));
                    for (let i = 0; i < count; i++) {
                        const idx = Math.floor(Math.random() * available.length);
                        const enemy = available[idx];
                        const captureAllowed = enemy.type === 'boss' && this.bossCount() > 1 && Math.random() < 0.3;
                        enemy.startAttack(captureAllowed);
                        available.splice(idx, 1);
                    }
                }
                this.attackCooldown = (2000 + Math.random() * 2000) / this.difficultyMultiplier();
            }
        }

        const remove = new Set();
        for (const e of this.enemies) {
            e.update(delta, game, this, player);
            // Collisions between enemy bodies/bullets and the player result in
            // a lost life.
            if (!this.challengeStage && player && rectsIntersect(e, player)) {
                player.loseLife();
                remove.add(e);
                continue;
            }
            for (const b of e.bullets) {
                if (!this.challengeStage && player && rectsIntersect({ x: b.x, y: b.y, width: 2, height: 6 }, player)) {
                    player.loseLife();
                    b.active = false;
                }
            }
        }

        if (player) {
            for (const bullet of [...player.bullets]) {
                let hitSomething = false;
                for (const enemy of this.enemies) {
                    if (enemy.capturedShip && rectsIntersect({ x: bullet.x, y: bullet.y, width: 2, height: 6 }, { x: enemy.capturedShip.x, y: enemy.capturedShip.y, width: 16, height: 16 })) {
                        const points = enemy.attacking ? 1000 : 500;
                        player.gainScore(points);
                        enemy.capturedShip = null;
                        player.bullets = player.bullets.filter(b => b !== bullet);
                        hitSomething = true;
                        break;
                    }
                    if (rectsIntersect({ x: bullet.x, y: bullet.y, width: 2, height: 6 }, enemy)) {
                        player.bullets = player.bullets.filter(b => b !== bullet);
                        if (enemy.challenge) {
                            player.gainScore(100);
                            this.challengeGroups[enemy.group].remaining -= 1;
                            this.challengeRemaining -= 1;
                            if (this.challengeGroups[enemy.group].remaining === 0) {
                                player.gainScore(1000);
                            }
                            if (this.challengeRemaining === 0) {
                                player.gainScore(10000);
                                this.challengePerfect = true;
                                this.perfectTimer = 2000;
                                const msg = document.getElementById('message');
                                if (msg) {
                                    msg.textContent = 'PERFECT!!  NUMBER OF HITS 40';
                                    msg.style.display = 'block';
                                }
                            }
                            if (this.explosionSound) {
                                this.explosionSound.currentTime = 0;
                                this.explosionSound.play();
                            }
                            if (enemy.attackPhase === 'capture') this.stopTractor();
                            remove.add(enemy);
                        } else {
                            // takeHit returns true when the enemy is destroyed. Bosses can survive one hit.
                            const destroyed = enemy.takeHit ? enemy.takeHit() : true;
                            if (destroyed) {
                                if (enemy.trio) {
                                    enemy.trio.remaining -= 1;
                                    if (enemy.trio.remaining === 0) {
                                        player.gainScore(enemy.trio.points);
                                    }
                                }
                            if (enemy.type === 'boss' && enemy.capturedShip && enemy.attacking) {
                                player.dual = true;
                            }
                            player.gainScore(killPoints(enemy, this));
                            if (this.explosionSound) {
                                this.explosionSound.currentTime = 0;
                                this.explosionSound.play();
                            }
                            if (enemy.attackPhase === 'capture') this.stopTractor();
                            remove.add(enemy);
                            } else {
                                player.gainScore(50);
                            }
                        }
                        hitSomething = true;
                        break;
                    }
                }
                if (hitSomething) continue;
            }
        }

        // Remove destroyed enemies and any that have flown off the bottom of
        // the screen.
        this.enemies = this.enemies.filter(e => {
            if (remove.has(e)) return false;
            const outOfBounds = e.y < -40 || e.y > game.height + 40 ||
                                e.x < -40 || e.x > game.width + 40;
            return !outOfBounds;
        });
    }

    render(ctx) {
        // Draw every enemy in the wave. Individual enemies handle their own
        // sprite logic so the manager simply forwards the canvas context.
        for (const e of this.enemies) {
            e.render(ctx);
        }
    }
}

function killPoints(enemy, manager) {
    const inFlight = !enemy.inFormation;
    if (enemy.type === 'bee') return inFlight ? 100 : 50;
    if (enemy.type === 'butterfly') return inFlight ? 160 : 80;
    if (enemy.type === 'boss') {
        const escorts = manager.enemies.filter(
            e => e !== enemy && e.attacking && (e.type === 'bee' || e.type === 'butterfly')
        ).length;
        if (escorts >= 2) return 1600;
        if (escorts === 1) return 800;
        return inFlight ? 400 : 150;
    }
    return inFlight ? 100 : 50;
}

function rectsIntersect(a, b) {
    // Basic axis-aligned bounding box collision test used throughout the game.
    return a.x < b.x + b.width && a.x + (a.width || 0) > b.x &&
           a.y < b.y + b.height && a.y + (a.height || 0) > b.y;
}
