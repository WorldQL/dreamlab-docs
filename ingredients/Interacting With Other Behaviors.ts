import { Behavior, Entity, EntityCollision } from "@dreamlab/engine";
import HealthBar from "./health-bar.ts";
import PlayerBehavior from "./player.ts";

/*
  Example: Using `getBehavior()` to Access Behaviors

  The `getBehavior()` method allows you to retrieve an existing behavior attached to an entity.
  This is particularly useful when you need to interact with or update a behavior that has already been set up,
  such as a health bar or UI component, without needing to instantiate it again.

  In this example, `getBehavior()` is used to update the player's score when an asteroid is destroyed,
  as well as to interact with the asteroid's health bar.

  Benefits of `getBehavior()`:
  - Prevents duplication of behavior instances.
  - Allows direct access to existing behaviors for updates or interactions.
  - Ensures that only one instance of the behavior is manipulated, maintaining consistency.
*/

export default class AsteroidBehavior extends Behavior {

  onInitialize(): void {
    this.listen(this.entity, EntityCollision, e => {
      if (e.started) this.onCollide(e.other);
    });
  }

  onCollide(other: Entity) {
    if (!other.name.startsWith("Bullet")) return;
    other.destroy();

    // Retrieve the HealthBar behavior for this entity
    const healthBar = this.entity.getBehavior(HealthBar);

    // Reduce the asteroid's health by 1
    healthBar.takeDamage(1);

    // If health reaches zero, update the player's score and destroy the asteroid
    if (healthBar.currentHealth <= 0) {
      const player = this.game.world._.Player;

      // Use getBehavior to access the PlayerBehavior and update the score
      player.getBehavior(PlayerBehavior).score += 50;

      // Destroy the asteroid entity (healthBar destruction is handled by takeDamage)
      this.entity.destroy();
    }
  }
}
