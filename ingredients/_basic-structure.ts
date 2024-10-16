import { Behavior, Vector2, Vector2Adapter } from '@dreamlab/engine'
/*
  In "@dreamlab/engine", a `Behavior` represents a modular piece of logic that can be attached to an entity.
  This allows you to encapsulate functionality, such as movement, health management, or AI, in reusable components.

  Key Components:
  - **Lifecycle Methods:**
    - `onInitialize`: Called once when the behavior is first attached to an entity, used for setup tasks.
    - `onTick`: Called on every game tick, ideal for updating logic like movement or state changes.
    - `onPreTick`, `onPostTick`, `onFrame`: Additional lifecycle hooks for more granular control over update timing.

  - **Values:** Behaviors can have properties (values) that are synchronized across the network or exposed to
    an inspector GUI. These values are defined using `defineValue` or `defineValues` methods and can be of various
    types, including primitives and complex types with adapters.

  - **Signals:** Behaviors can listen for signals (events) from the game or other entities and respond accordingly.
    This is done using the `listen` method for subscribing to signals, and `fire` to emit them.

  - **Destruction:** Behaviors can be destroyed manually using `destroy()` or automatically via the entity lifecycle.
    This cleanup process ensures all listeners and values are properly disposed of.

  The `Behavior` class is highly flexible, supporting complex game mechanics through a combination of values, signals,
  and lifecycle hooks. It serves as the foundation for defining how entities behave in the game world.

  If you want to get the width or height of the screen, you can use this.game.renderer.app.canvas.width / height.

  this.game.renderer.app is a Pixi application. When making calls to pixi, you must import it as:
  import * as PIXI from "@dreamlab/vendor/pixi.ts";

*/

// example Behavior that allows for WASD movement as well as a pattern for firing projectiles.
// this serves as an example for the general structure of a behavior
class Movement extends Behavior {
  // the speed of the player
  speed = 5.0
  // example value
  anotherValue = 42.0
  // the current velocity of the player
  velocity = Vector2.ZERO

  #up = this.inputs.create('@movement/up', 'Move Up', 'KeyW')
  #down = this.inputs.create('@movement/down', 'Move Down', 'KeyS')
  #left = this.inputs.create('@movement/left', 'Move Left', 'KeyA')
  #right = this.inputs.create('@movement/right', 'Move Right', 'KeyD')

  // the setup method should ONLY be used for calls to defineValue. Anything else should go in onInitialize which will run when the behavior is spawned.
  setup(): void {
    // definevalue calls make the public class variables visible in the inspector GUI and also sync over the network
    // define multiple values at once by passing them as more arguments. do not pass a list.
    this.defineValues(Movement, 'speed', 'anotherValue')
    this.defineValue(Movement, 'velocity', { type: Vector2Adapter })
  }

  onTick(): void {
    const movement = new Vector2(0, 0)
    const currentSpeed = this.speed

    if (this.#up.held) movement.y += 1
    if (this.#down.held) movement.y -= 1
    if (this.#right.held) movement.x += 1
    if (this.#left.held) movement.x -= 1

    this.velocity = movement.normalize().mul((this.game.physics.tickDelta / 100) * currentSpeed)

    const newPosition = this.entity.transform.position.add(this.velocity)
  }
}
