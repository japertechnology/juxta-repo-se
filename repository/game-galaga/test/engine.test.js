import { jest } from "@jest/globals";
import { Game } from '../src/engine.js';

describe('Game', () => {
  test('addEntity registers new entity', () => {
    const g = new Game({}, 100, 100);
    const obj = {};
    g.addEntity(obj);
    expect(g.entities).toContain(obj);
  });

  test('update calls entity update with delta and game', () => {
    const g = new Game({}, 100, 100);
    const ent = { update: jest.fn() };
    g.addEntity(ent);
    g.update(16);
    expect(ent.update).toHaveBeenCalledWith(16, g);
  });

  test('render clears canvas and renders entities', () => {
    const ctx = { clearRect: jest.fn() };
    const g = new Game(ctx, 100, 100);
    const a = { render: jest.fn() };
    const b = { render: jest.fn() };
    g.addEntity(a);
    g.addEntity(b);
    g.render();
    expect(ctx.clearRect).toHaveBeenCalledWith(0, 0, 100, 100);
    expect(a.render).toHaveBeenCalledWith(ctx);
    expect(b.render).toHaveBeenCalledWith(ctx);
  });
});
