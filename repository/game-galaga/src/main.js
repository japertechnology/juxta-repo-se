// -------------------------------------------------------------
// Game Bootstrapping with DIP Switch Settings and Self-Test
// -------------------------------------------------------------
import { Game } from './engine.js';
import { Player } from './player.js';
import { EnemyManager } from './enemy.js';
import { loadAssets } from './assets.js';

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreEl = document.getElementById('score');
const livesEl = document.getElementById('lives');

let assets = null;
let attractInterval = null;
let demoTimeout = null;
let stopLoop = null;

function dipSettings() {
    const diffMap = { A: 'easy', B: 'medium', C: 'hard', D: 'hardest' };
    const bonusSel = document.getElementById('bonus').value;
    let bonusFirst = 20000;
    let bonusEvery = 70000;
    if (bonusSel === '30k80k') { bonusFirst = 30000; bonusEvery = 80000; }
    if (bonusSel === '20kOnce') { bonusFirst = 20000; bonusEvery = 0; }
    return {
        difficulty: diffMap[document.getElementById('difficulty').value],
        startingLives: parseInt(document.getElementById('startingLives').value, 10),
        bonusFirst,
        bonusEvery,
        rapidFire: document.getElementById('rapidFire').checked,
        attractSound: document.getElementById('attractSound').checked
    };
}

function startAttract() {
    const opts = dipSettings();
    if (opts.attractSound && assets && assets.shoot) {
        attractInterval = setInterval(() => {
            assets.shoot.currentTime = 0;
            assets.shoot.play();
        }, 2000);
    }
    demoTimeout = setTimeout(() => {
        stopLoop && stopLoop();
        stopLoop = startGame(false, true);
    }, 100);
}

function stopAttract() {
    if (attractInterval) clearInterval(attractInterval);
    attractInterval = null;
    if (demoTimeout) clearTimeout(demoTimeout);
    demoTimeout = null;
    if (typeof stopLoop === 'function') { stopLoop(); stopLoop = null; }
}

export function runSelfTest() {
    stopAttract();
    const opts = dipSettings();
    document.getElementById('dipReadout').textContent = JSON.stringify(opts, null, 2);
    document.getElementById('selfTest').style.display = 'block';
    document.getElementById('playSound').onclick = () => {
        if (assets && assets.shoot) {
            assets.shoot.currentTime = 0;
            assets.shoot.play();
        }
    };
    document.getElementById('closeTest').onclick = () => {
        document.getElementById('selfTest').style.display = 'none';
        startAttract();
    };
}

export function startGame(isPlayer2 = false, demo = false) {
    stopAttract();
    const opts = dipSettings();
    const game = new Game(ctx, canvas.width, canvas.height);
    const player = new Player(canvas.width / 2 - 8, canvas.height - 40, assets, isPlayer2, {
        rapidFire: opts.rapidFire,
        startingLives: opts.startingLives,
        bonusFirst: opts.bonusFirst,
        bonusEvery: opts.bonusEvery,
        demo
    });
    const enemies = new EnemyManager(assets, opts.difficulty);
    game.addEntity(player);
    game.addEntity(enemies);
    if (!demo) document.getElementById('settings').style.display = 'none';

    let running = true;
    let animId;
    function loop() {
        if (!running) return;
        game.update(16);
        game.render();
        scoreEl.textContent = player.formattedScore();
        livesEl.textContent = player.lives;
        animId = requestAnimationFrame(loop);
    }
    animId = requestAnimationFrame(loop);
    if (demo) {
        demoTimeout = setTimeout(() => {
            running = false;
            document.getElementById('settings').style.display = 'block';
            startAttract();
        }, 10000);
    }
    return () => { running = false; cancelAnimationFrame(animId); };
}

async function init() {
    assets = await loadAssets({
        player: 'assets/player.png',
        enemy: 'assets/enemy.png',
        bullet: 'assets/bullet.png',
        shoot: 'assets/shoot.wav',
        explosion: 'assets/explosion.wav',
        tractor: 'assets/tractor.wav',
        start: 'assets/start.wav'
    });
    document.getElementById('settings').style.display = 'block';
    document.getElementById('startBtn').onclick = () => startGame(false, false);
    const p2 = document.getElementById('startP2Btn');
    if (p2) p2.onclick = () => startGame(true, false);
    document.getElementById('selfTestBtn').onclick = runSelfTest;
    startAttract();
}

init();
