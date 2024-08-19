import { Behavior, Vector2 } from "@dreamlab/engine";

/*
  Handling Values in Behaviors:

  In "@dreamlab/engine", values within behaviors are critical for maintaining and synchronizing
  the state across the network. Values can represent anything from simple properties like speed
  or health to more complex game states.

  Key Points:
  - **Defining Values:**
    Values are defined using the `defineValues` or `defineValue` method, which binds a property
    to the behavior, ensuring it is properly managed and optionally synchronized across the network.

  - **Value Synchronization:**
    By default, values are local to the behavior, but they can be set to replicate across
    the network by configuring the `opts.replicated` option when defining a value.

  - **Accessing Values:**
    Once defined, values can be accessed and modified like any other property. However,
    they are wrapped in a `Value` object that manages synchronization, type checking,
    and default values.

  Below is an example demonstrating how to define and use values within a behavior.
*/

export default class PlayerMovement extends Behavior {
  // Define a synced value for the player's speed
  speed = 5.0;

  #up = this.inputs.create("@movement/up", "Move Up", "KeyW");
  #down = this.inputs.create("@movement/down", "Move Down", "KeyS");
  #left = this.inputs.create("@movement/left", "Move Left", "KeyA");
  #right = this.inputs.create("@movement/right", "Move Right", "KeyD");
  #boost = this.inputs.create("@movement/boost", "Speed Boost", "ShiftLeft");

  onInitialize() {
    /*
      Defining the `speed` value to be managed by the behavior.
      - The `defineValues` method is used to specify which properties should be treated as values.
      - Once defined, `speed` will be managed by the internal value system, allowing it to be
        synchronized across the network if needed.
    */
    this.defineValues(PlayerMovement, "speed");
  }

  onTick(): void {
    // Ensure that only the entity's owner can control it
    if (this.entity.authority !== this.game.network.self) return;

    const movement = new Vector2(0, 0);

    if (this.#up.held) movement.y += 1;
    if (this.#down.held) movement.y -= 1;
    if (this.#right.held) movement.x += 1;
    if (this.#left.held) movement.x -= 1;

    // Adjust speed if boost is held
    let currentSpeed = this.speed;
    if (this.#boost.held) currentSpeed *= 2;

    const velocity = movement
      .normalize()
      .mul((this.game.physics.tickDelta / 100) * currentSpeed);

    this.entity.transform.position = this.entity.transform.position.add(velocity);

    const cursorPos = this.inputs.cursor.world;
    if (cursorPos) {
      this.entity.transform.rotation = this.entity.pos.lookAt(cursorPos);
    }
  }
}
