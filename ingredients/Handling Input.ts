import { Behavior, BehaviorContext, Vector2 } from "@dreamlab/engine";
import PlayerBehavior from "./player.ts";

/*
  Handling Inputs in a Behavior:

  This example demonstrates how to set up and handle various inputs within a behavior using the `Inputs` class.
  Inputs are created for specific actions (e.g., movement or firing), and these actions are then checked and handled
  during the behavior's update cycle (`onTick`).

  Key Concepts:
  - **Input Creation:**
    Inputs are created using `this.inputs.create(...)`, binding a specific action to a key or mouse button.
    These inputs are stored in private fields and can be checked every frame to determine if the corresponding
    action should be executed.

  - **Input Handling:**
    Each frame, the behavior checks whether an input (e.g., a key or mouse button) is held down and executes
    the appropriate logic, such as moving an entity or firing a weapon.

  - **Cursor Tracking:**
    The `Inputs` class also provides cursor tracking, which allows the entity to rotate or aim based on the cursor's
    position in the game world.

  Below is the implementation of the `Movement` behavior that handles player movement and firing based on input.
*/

export default class Movement extends Behavior {
  speed = 5.0;

  // Input bindings for movement
  #up = this.inputs.create("@movement/up", "Move Up", "KeyW");
  #down = this.inputs.create("@movement/down", "Move Down", "KeyS");
  #left = this.inputs.create("@movement/left", "Move Left", "KeyA");
  #right = this.inputs.create("@movement/right", "Move Right", "KeyD");

  // Input binding for firing
  #fire = this.inputs.create("@clickFire/fire", "Fire", "MouseLeft");

  // Cooldown management for firing
  readonly #cooldown = 0;
  #lastFired = 0;

  velocity = Vector2.ZERO;

  constructor(ctx: BehaviorContext) {
    super(ctx);
    this.defineValues(Movement, "speed");
  }

  onTick(): void {
    const movement = new Vector2(0, 0);
    const currentSpeed = this.speed;

    // Handle movement inputs
    if (this.#up.held) movement.y += 1;
    if (this.#down.held) movement.y -= 1;
    if (this.#right.held) movement.x += 1;
    if (this.#left.held) movement.x -= 1;

    // Calculate the velocity based on movement input and speed
    this.velocity = movement
      .normalize()
      .mul((this.game.physics.tickDelta / 100) * currentSpeed);

    // Update entity's position
    const newPosition = this.entity.transform.position.add(this.velocity);

    // Boundary checks can be added here to restrict movement within certain limits

    // Handle firing input with cooldown management
    if (this.#lastFired > 0) {
      this.#lastFired -= 1;
    } else {
      if (this.#fire.held) {
        const playerBehavior = this.entity.getBehavior(PlayerBehavior);
        const fireRateMultiplier = playerBehavior.fireRateMultiplier;

        this.#lastFired = this.#cooldown / fireRateMultiplier;

        // Trigger the shooting pattern defined in PlayerBehavior
        playerBehavior.shootingPattern();
      }
    }

    // Rotate the entity to face the cursor's position
    const world = this.inputs.cursor.world;
    if (!world) return;

    const rotation = this.entity.transform.position.lookAt(world);
    this.entity.transform.rotation = rotation;

    // Apply the new position to the entity
    this.entity.transform.position = newPosition;
  }
}
