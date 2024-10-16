import { Behavior, Entity, EntityCollision } from '@dreamlab/engine'
import HealthBar from './health-bar.ts'
import PlayerBehavior from './player.ts'

/*
  Handling Collisions in Game Entities:

  The `EntityCollision` signal in "@dreamlab/engine"
  helps detect when two entities collide. This signal provides details like whether the collision
  has just started and the other entity involved.

  Key Points:
  - **Listening for Collisions:** Use the `listen` method to react to collision events.
  - **Collision Filtering:** Handle collisions only with specific entities by checking their properties.
  - **Responding to Collisions:** For example, decrease health or destroy an entity when a collision occurs.

  Below is an `EnemyBehavior` that reduces health when hit by a bullet and increases the player's score if the enemy is destroyed.
*/

export default class EnemyBehavior extends Behavior {
  private healthBar!: HealthBar

  onInitialize(): void {
    const health = Math.floor(Math.random() * 3) + 3
    this.healthBar = this.entity.addBehavior({
      type: HealthBar,
      values: { maxHealth: health, currentHealth: health },
    })

    // Listen for collision event
    this.listen(this.entity, EntityCollision, e => {
      if (e.started) this.onCollide(e.other)
    })
  }

  // Example of collision usage. We only want this entity to collide with the "Bullet" entity
  onCollide(other: Entity) {
    if (!other.name.startsWith('Bullet')) return

    other.destroy()
    this.healthBar.takeDamage(1)
    if (this.healthBar.currentHealth <= 0) {
      const player = this.entity.game.world._.Player
      player.getBehavior(PlayerBehavior).score += 100
    }
  }
}
