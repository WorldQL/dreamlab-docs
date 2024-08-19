import { Behavior, Vector2, Vector2Adapter } from "@dreamlab/engine";
import { MAP_BOUNDARY } from "./_constants.ts";

// example Behavior that allows for WASD movement as well as a pattern for firing projectiles.
// this serves as an example for the general structure of a behavior
class Movement extends Behavior {
  // the speed of the player
  speed = 5.0;
  // the current velocity of the player
  velocity = Vector2.ZERO;

  #up = this.inputs.create("@movement/up", "Move Up", "KeyW");
  #down = this.inputs.create("@movement/down", "Move Down", "KeyS");
  #left = this.inputs.create("@movement/left", "Move Left", "KeyA");
  #right = this.inputs.create("@movement/right", "Move Right", "KeyD");

  onInitialize(): void {
    // definevalue calls make the public class variables visible in the inspector GUI and also sync over the network
    this.defineValue(Movement, "speed");
    this.defineValue(Movement, "velocity", { type: Vector2Adapter });
  }

  onTick(): void {
    const movement = new Vector2(0, 0);
    const currentSpeed = this.speed;

    if (this.#up.held) movement.y += 1;
    if (this.#down.held) movement.y -= 1;
    if (this.#right.held) movement.x += 1;
    if (this.#left.held) movement.x -= 1;

    this.velocity = movement
      .normalize()
      .mul((this.game.physics.tickDelta / 100) * currentSpeed);

    const newPosition = this.entity.transform.position.add(this.velocity);

    const halfWidth = this.entity.transform.scale.x / 2;
    const halfHeight = this.entity.transform.scale.y / 2;

    // don't move beyond the map boundaries
    if (newPosition.x - halfWidth <= -MAP_BOUNDARY) newPosition.x = -MAP_BOUNDARY;
    if (newPosition.x + halfWidth >= MAP_BOUNDARY) newPosition.x = MAP_BOUNDARY;

    if (newPosition.y - halfHeight <= -MAP_BOUNDARY) newPosition.y = -MAP_BOUNDARY;
    if (newPosition.y + halfHeight >= MAP_BOUNDARY) newPosition.y = MAP_BOUNDARY;

    // make the entity this behavior is attached to face the player
    const world = this.inputs.cursor.world;
    if (!world) return;

    const rotation = this.entity.transform.position.lookAt(world);
    this.entity.transform.rotation = rotation;

    this.entity.transform.position = newPosition;
  }
}
