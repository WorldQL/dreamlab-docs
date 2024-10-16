import { Behavior, Entity, EntityCollision } from '@dreamlab/engine'
import PlayerBehavior from './player.ts'

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
      if (e.started) this.onCollide(e.other)
    })
  }

  onCollide(other: Entity) {
    if (!other.name.startsWith('Bullet')) return
    other.destroy()

    // Retrieve the HealthBar behavior for this entity
    const healthBar = this.entity.getBehavior(HealthBar)

    // Reduce the asteroid's health by 1
    healthBar.takeDamage(1)

    // If health reaches zero, update the player's score and destroy the asteroid
    if (healthBar.currentHealth <= 0) {
      const player = this.game.world._.Player

      // Use getBehavior to access the PlayerBehavior and update the score
      player.getBehavior(PlayerBehavior).score += 50

      // Destroy the asteroid entity (healthBar destruction is handled by takeDamage)
      this.entity.destroy()
    }
  }
}

// Health bar behavior for reference
import { Behavior, BehaviorContext, Entity, GamePostTick, RectCollider, Sprite, Vector2 } from '@dreamlab/engine'

export default class HealthBar extends Behavior {
  maxHealth: number = 100
  currentHealth: number = 100
  healthBarEntity!: Entity

  constructor(ctx: BehaviorContext) {
    super(ctx)
    this.defineValues(HealthBar, 'maxHealth', 'currentHealth')
  }

  onInitialize(): void {
    this.healthBarEntity = this.game.world.spawn({
      type: Sprite,
      name: 'HealthBar',
      transform: { position: { x: 0, y: 1 }, scale: { x: 1, y: 0.1 } },
      values: { texture: 'res://assets/healthbar.png' },
    })

    this.game.on(GamePostTick, () => {
      this.healthBarEntity.pos = this.entity.pos.add(new Vector2(0, 1))
      this.updateHealthBar()
    })
  }

  updateHealthBar(): void {
    const healthRatio = this.currentHealth / this.maxHealth
    this.healthBarEntity.transform.scale.x = healthRatio
  }

  takeDamage(damage: number): void {
    this.currentHealth -= damage
    if (this.currentHealth <= 0) {
      this.currentHealth = 0
      this.entity.destroy()
      this.healthBarEntity.destroy()
      this.spawnExplosionPieces()
    }

    this.updateHealthBar()
  }

  spawnExplosionPieces(): void {
    const pieceCount = Math.random() * 5 + 3
    const pieceSize = { x: 0.15, y: 0.15 }

    for (let i = 0; i < pieceCount; i++) {
      this.entity.game.world.spawn({
        type: Sprite,
        name: 'ExplosionPiece',
        transform: {
          position: this.entity.transform.position.clone(),
          scale: pieceSize,
        },
        behaviors: [],
        children: [
          {
            type: Sprite,
            name: 'PieceSprite',
            values: { texture: 'res://assets/asteroid.png' },
          },
        ],
      })
    }
  }
}
