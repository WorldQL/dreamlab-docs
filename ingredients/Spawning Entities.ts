import { Behavior, Rigidbody2D, Sprite2D } from "@dreamlab/engine";
import BulletBehavior from "./bullet.ts";

/*
  Spawning Entities Overview:

  There are multiple ways to spawn entities in the game using the "@dreamlab/engine" package.
  Each method is suitable for different scenarios, depending on your needs.

  1. **Cloning a Prefab:**
     - This method is ideal for spawning predefined entities, such as players or enemies, that have been set up as prefabs.
     - You can clone a prefab into the world and customize its properties (e.g., name, position, authority).

     Example:
     ```typescript
     this.game.prefabs._.Player.cloneInto(this.game.world, {
       name: "Player." + this.game.network.self,
       transform: { position: { x: 0, y: 0 } },
       authority: this.game.network.self,
     });
     ```

  2. **Spawning from Scratch:**
     - For more complex entities that may not have a predefined prefab, you can spawn them directly by defining their components and behaviors in the spawn call.
     - This method allows you to create fully customized entities on the fly.

     Example:
     ```typescript
     this.entity.game.world.spawn({
       type: Rigidbody2D,
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
     ```
*/

export default class PlayerSpawner extends Behavior {
  onInitialize(): void {
    // Cloning a prefab to spawn a player entity.
    if (!this.game.isClient()) return;

    this.game.prefabs._.Player.cloneInto(this.game.world, {
      name: "Player." + this.game.network.self,
      transform: { position: { x: 0, y: 0 } },
      authority: this.game.network.self,
    });

    // Modify the local camera entity's scale after spawning the player.
    this.game.local._.Camera.transform.scale.assign({ x: 2, y: 2 });
  }
}

export default class EnemyMovement extends Behavior {
  speed = Math.random() * 0.5 + 0.5;
  minDistance = 5;
  shootDistance = 10;
  lastShootTime = 0;
  shootCooldown = Math.random() * 2000 + 1000;

  onTick(): void {
    const player = this.entity.game.world.children.get("Player");
    const playerPos = player?.globalTransform.position;
    if (!playerPos) return;

    const direction = playerPos.sub(this.entity.transform.position).normalize();
    const distance = playerPos.sub(this.entity.transform.position).magnitude();

    if (distance > this.minDistance + 5) {
      let speedFactor = 1;
      if (distance < this.minDistance + 10) {
        speedFactor = (distance - this.minDistance) / 10;
      }
      this.entity.transform.position = this.entity.transform.position.add(
        direction.mul((this.time.delta / 100) * this.speed * speedFactor),
      );
    }

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

    // Spawning a bullet entity with custom components and behaviors
    this.entity.game.world.spawn({
      type: Rigidbody2D,
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
