import { EnemyManager } from '../src/enemy.js';

describe('EnemyManager.isChallengingStage', () => {
  const mgr = new EnemyManager();

  test('returns true for stages 3, 7, 11 and so on', () => {
    for (let stage = 3; stage <= 39; stage += 4) {
      expect(mgr.isChallengingStage(stage)).toBe(true);
    }
  });

  test('returns false for all other stages', () => {
    const falsy = [];
    for (let i = 1; i <= 260; i++) {
      if (!(i >= 3 && (i - 3) % 4 === 0 && i !== 255)) falsy.push(i);
    }
    falsy.forEach(stage => {
      expect(mgr.isChallengingStage(stage)).toBe(false);
    });
  });
});
