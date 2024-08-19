import { Behavior, Entity, EntityCollision } from "@dreamlab/engine";
import HealthBar from "./health-bar.ts";
import PlayerBehavior from "./player.ts";

// Example of entity collision
export default class EnemyBehavior extends Behavior {
  private healthBar!: HealthBar;

  onInitialize(): void {
    const health = Math.floor(Math.random() * 3) + 3;
    this.healthBar = this.entity.addBehavior({
      type: HealthBar,
      values: { maxHealth: health, currentHealth: health },
    });

    // Listen for collision event
    this.listen(this.entity, EntityCollision, e => {
      if (e.started) this.onCollide(e.other);
    });
  }

  // Example of collision usage. We only want this entity to collide with the "Bullet" entity
  onCollide(other: Entity) {
    if (!other.name.startsWith("Bullet")) return;

    other.destroy();
    this.healthBar.takeDamage(1);
    if (this.healthBar.currentHealth <= 0) {
      const player = this.entity.game.world._.Player;
      player.getBehavior(PlayerBehavior).score += 100;
    }
  }
}
