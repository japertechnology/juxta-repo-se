import { Player } from '../src/player.js';

describe('Player bullet management', () => {
  test('updateBullets moves bullets and removes offscreen ones', () => {
    const p = new Player(0, 0);
    p.bullets = [{ x: 1, y: 5 }, { x: 2, y: -5 }];
    p.updateBullets();
    expect(p.bullets).toHaveLength(1);
    expect(p.bullets[0].y).toBe(-1);
  });

  test('loseLife resets position, clears bullets and dual mode', () => {
    const p = new Player(10, 20);
    p.x = 30;
    p.y = 40;
    p.bullets = [{ x: 0, y: 0 }];
    p.dual = true;
    p.loseLife();
    expect(p.x).toBe(10);
    expect(p.y).toBe(20);
    expect(p.bullets).toHaveLength(0);
    expect(p.dual).toBe(false);
  });
});
