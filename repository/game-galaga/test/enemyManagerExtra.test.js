import { EnemyManager, Enemy } from '../src/enemy.js';

describe('EnemyManager helper functions', () => {
  test('difficultyMultiplier scales with stage', () => {
    const mgr = new EnemyManager();
    expect(mgr.difficultyMultiplier()).toBeCloseTo(1);
    mgr.stage = 6;
    expect(mgr.difficultyMultiplier()).toBeCloseTo(1 + (6 - 1) * 0.05);
  });

  test('bossCount counts boss type enemies', () => {
    const mgr = new EnemyManager();
    mgr.enemies = [
      new Enemy(0, 0, 0, 0, 'boss'),
      new Enemy(0, 0, 0, 0, 'bee'),
      new Enemy(0, 0, 0, 0, 'boss')
    ];
    expect(mgr.bossCount()).toBe(2);
  });

  test('beeBulletCount totals active bee bullets', () => {
    const mgr = new EnemyManager();
    const bee1 = new Enemy(0, 0, 0, 0, 'bee');
    bee1.bullets = [{ active: true }, { active: false }];
    const bee2 = new Enemy(0, 0, 0, 0, 'bee');
    bee2.bullets = [{ active: true }, { active: true }];
    mgr.enemies = [bee1, bee2];
    expect(mgr.beeBulletCount()).toBe(3);
  });

  test('spawnTrio adds three attacking enemies with trio info', () => {
    const mgr = new EnemyManager();
    const game = { width: 200 };
    mgr.spawnTrio(game, 'scorpion');
    expect(mgr.enemies).toHaveLength(3);
    mgr.enemies.forEach(e => {
      expect(e.attacking).toBe(true);
      expect(e.attackPhase).toBe('dive');
      expect(e.trio).toBeDefined();
      expect(e.trio.remaining).toBe(3);
      expect(e.trio.points).toBe(1000);
    });
  });

  test('spawnChallengingStage creates 40 challenge enemies', () => {
    const mgr = new EnemyManager();
    const game = { width: 300 };
    mgr.spawnChallengingStage(game);
    expect(mgr.challengeStage).toBe(true);
    expect(mgr.challengeGroups).toHaveLength(5);
    expect(mgr.challengeGroups.every(g => g.remaining === 8)).toBe(true);
    expect(mgr.challengeRemaining).toBe(40);
    expect(mgr.enemies).toHaveLength(40);
    mgr.enemies.forEach(e => expect(e.challenge).toBe(true));
  });
});
