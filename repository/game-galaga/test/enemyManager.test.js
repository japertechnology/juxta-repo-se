import { EnemyManager } from '../src/enemy.js';

describe('EnemyManager.trioTypeForStage', () => {
  const mgr = new EnemyManager();

  test('returns null for stages before 4', () => {
    expect(mgr.trioTypeForStage(1)).toBeNull();
    expect(mgr.trioTypeForStage(3)).toBeNull();
  });

  test('cycles through trio types', () => {
    expect(mgr.trioTypeForStage(4)).toBe('scorpion');
    expect(mgr.trioTypeForStage(5)).toBe('scorpion');
    expect(mgr.trioTypeForStage(6)).toBe('scorpion');
    expect(mgr.trioTypeForStage(7)).toBeNull();
    expect(mgr.trioTypeForStage(8)).toBe('bosconian');
    expect(mgr.trioTypeForStage(12)).toBe('galaxian');
    expect(mgr.trioTypeForStage(16)).toBe('scorpion');
  });
});

describe('EnemyManager.isChallengingStage', () => {
  const mgr = new EnemyManager();

  test('returns true for stages 3, 7, 11, etc.', () => {
    expect(mgr.isChallengingStage(3)).toBe(true);
    expect(mgr.isChallengingStage(7)).toBe(true);
    expect(mgr.isChallengingStage(11)).toBe(true);
    expect(mgr.isChallengingStage(15)).toBe(true);
  });

  test('returns false for non-challenging stages', () => {
    expect(mgr.isChallengingStage(1)).toBe(false);
    expect(mgr.isChallengingStage(5)).toBe(false);
    expect(mgr.isChallengingStage(9)).toBe(false);
    expect(mgr.isChallengingStage(255)).toBe(false);
  });
});
