import { Player } from '../src/player.js';

describe('Player.formattedScore', () => {
  test('pads score to six digits for player 1', () => {
    const p = new Player(0, 0);
    p.score = 500;
    expect(p.formattedScore()).toBe('000500');
  });

  test('pads score to seven digits for player 2', () => {
    const p2 = new Player(0, 0, {}, true);
    p2.score = 500;
    expect(p2.formattedScore()).toBe('0000500');
  });
});

describe('Player.gainScore', () => {
  test('bonus lives stop after one million points', () => {
    const p = new Player(0, 0);
    p.gainScore(1000000);
    expect(p.lives).toBe(18);
    expect(p.nextLifeScore).toBe(Infinity);
    const livesAfterMillion = p.lives;
    p.gainScore(500000);
    expect(p.lives).toBe(livesAfterMillion);
    expect(p.nextLifeScore).toBe(Infinity);
  });
});

describe('Player.loseLife', () => {
  test('resets position to the initial spawn point', () => {
    const p = new Player(123, 456);
    p.x = 10;
    p.y = 20;
    p.loseLife();
    expect(p.x).toBe(123);
    expect(p.y).toBe(456);
  });
});

describe('Player.fire bullet cap', () => {
  test('limits bullets to two in single fighter mode', () => {
    const p = new Player(0, 0);
    for (let i = 0; i < 10; i++) {
      p.fireCooldown = 0;
      p.fire();
      expect(p.bullets.length).toBeLessThanOrEqual(2);
    }
  });

  test('limits bullets to four in dual fighter mode', () => {
    const p = new Player(0, 0);
    p.dual = true;
    for (let i = 0; i < 10; i++) {
      p.fireCooldown = 0;
      p.fire();
      expect(p.bullets.length).toBeLessThanOrEqual(4);
    }
  });
});
