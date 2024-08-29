// Example of changing an entities position through a behavior. This one is more basic.
import { Behavior, Vector2 } from "@dreamlab/engine";

/*
  Key Points:
  - **Basic Movement:** Calculate the new position by adding a direction vector to the current position.
  - **Transform Properties:** Use properties like `position`, `rotation`, and `scale` to control entity movement and appearance.

  This example moves an asteroid in a random direction at a constant speed.
*/
export default class AsteroidMovement extends Behavior {
  readonly #direction = new Vector2(
    Math.random() * 2 - 1,
    Math.random() * 2 - 1
  ).normalize();

  speed = 0.2;

  onInitialize() {
    this.defineValue(AsteroidMovement, "speed");
  }

  /*
  Properties available under entity.transform are:
  - scale.x, scale.y
  - position.x, position.y
  - entity.transform.z (used for zIndex ordering)
  - entity.transform.rotation (radians)
  */

  onTick(): void {
    this.entity.transform.position = this.entity.transform.position.add(
      this.#direction.mul((this.time.delta / 100) * this.speed)
    );
  }
}

// Example of moving an entity based on another entities position. A more advanced example
import { Behavior, RectCollider2D, Sprite2D } from "@dreamlab/engine";
import BulletBehavior from "./bullet.ts";

export default class EnemyMovement extends Behavior {
  speed = Math.random() * 0.5 + 0.5;
  minDistance = 5;
  shootDistance = 10;
  lastShootTime = 0;
  shootCooldown = Math.random() * 2000 + 1000;

  onTick(): void {
    // Find the player entity
    const player = this.entity.game.world.children.get("Player");
    const playerPos = player?.globalTransform.position;
    if (!playerPos) return;

    const direction = playerPos.sub(this.entity.transform.position).normalize();
    const distance = playerPos.sub(this.entity.transform.position).magnitude();

    // In this example we only move the entity towards the player if they are outside a certain distance
    if (distance > this.minDistance + 5) {
      let speedFactor = 1;
      if (distance < this.minDistance + 10) {
        speedFactor = (distance - this.minDistance) / 10;
      }
      this.entity.transform.position = this.entity.transform.position.add(
        direction.mul((this.time.delta / 100) * this.speed * speedFactor)
      );
    }

    // Adjust rotation of entity so its facing the correct direction
    const rotation = Math.atan2(direction.y, direction.x);
    this.entity.transform.rotation = rotation - Math.PI / 2;

    if (distance <= this.shootDistance) {
      const now = Date.now();
      if (now - this.lastShootTime > this.shootCooldown) {
        this.lastShootTime = now;
        this.shootAtPlayer();
      }
    }
  }

  shootAtPlayer(): void {
    const rotation = this.entity.transform.rotation + Math.PI / 2;

    this.entity.game.world.spawn({
      type: RectCollider2D,
      name: "EnemyBullet",
      transform: {
        position: this.entity.transform.position.clone(),
        rotation,
        scale: { x: 0.25, y: 0.25 },
      },
      behaviors: [{ type: BulletBehavior, values: { speed: 8 } }],
      children: [
        {
          type: Sprite2D,
          name: "BulletSprite",
          transform: {
            scale: { x: 0.75, y: 0.75 },
          },
        },
      ],
    });
  }
}
