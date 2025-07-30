// -------------------------------------------------------------
// Minimal Game Engine
// -------------------------------------------------------------
//
// This class drives the entire simulation.  It maintains a list of "entities"
// (any object with `update()` and/or `render()` methods) and invokes them each
// frame.  The engine itself knows nothing about Galaga—it merely provides the
// timing and rendering surface for game objects to act upon.
export class Game {
    constructor(ctx, width, height) {
        this.ctx = ctx;
        this.width = width;
        this.height = height;
        // List of child objects that participate in the simulation. The engine
        // simply iterates over this array each frame.
        this.entities = [];
    }

    // Register a new entity with the engine. Entities are updated and rendered
    // in the order they are added.
    addEntity(entity) {
        this.entities.push(entity);
    }

    // Advance the simulation by `delta` milliseconds. Each entity decides how
    // that translates into movement or other logic.
    update(delta) {
        for (const e of this.entities) {
            if (e.update) e.update(delta, this);
        }
    }

    // Clear the canvas and then draw each entity.  Rendering order again
    // follows the order of registration in `entities`.
    render() {
        this.ctx.clearRect(0, 0, this.width, this.height);
        for (const e of this.entities) {
            if (e.render) e.render(this.ctx);
        }
    }
}
