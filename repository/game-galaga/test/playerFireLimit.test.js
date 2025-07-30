import { Player } from '../src/player.js';

describe('Player.fire bullet limit', () => {
  test('single fighter limited to two bullets', () => {
    const p = new Player(0, 0);
    for (let i = 0; i < 5; i++) {
      p.fireCooldown = 0;
      p.fire();
    }
    expect(p.bullets.length).toBe(2);
  });

  test('dual fighter limited to four bullets', () => {
    const p = new Player(0, 0);
    p.dual = true;
    for (let i = 0; i < 5; i++) {
      p.fireCooldown = 0;
      p.fire();
    }
    expect(p.bullets.length).toBe(4);
  });

  test('does not exceed limit when near cap', () => {
    const p = new Player(0, 0);
    p.dual = true;
    p.bullets = [{ x: 0, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 0 }];
    p.fireCooldown = 0;
    p.fire();
    expect(p.bullets.length).toBe(4);

    const p2 = new Player(0, 0);
    p2.bullets = [{ x: 0, y: 0 }];
    p2.fireCooldown = 0;
    p2.fire();
    expect(p2.bullets.length).toBe(2);
  });
});
