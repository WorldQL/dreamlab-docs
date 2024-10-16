// This is an example of how to implement a platformer controller using the KinematicCharacterController

import { Behavior, EntityDestroyed, RectCollider, Vector2 } from '@dreamlab/engine'
import { KinematicCharacterController } from '@dreamlab/vendor/rapier.ts'

export default class PlatformMovement extends Behavior {
  #collider: RectCollider = this.entity.cast(RectCollider)
  #controller: KinematicCharacterController | undefined

  speed = 10.0
  jumpForce = 20.0
  jumpAcceleration = 40
  gravity = 90.0
  maxJumpTime = 1 // Maximum duration the jump key affects the jump

  #verticalVelocity = 0
  #isGrounded = false
  #jumpTimeCounter = 0

  #up = this.inputs.create('@movement/up', 'Move Up', 'KeyW')
  #down = this.inputs.create('@movement/down', 'Move Down', 'KeyS')
  #left = this.inputs.create('@movement/left', 'Move Left', 'KeyA')
  #right = this.inputs.create('@movement/right', 'Move Right', 'KeyD')
  #jump = this.inputs.create('@movement/jump', 'Jump', 'Space')

  setup() {
    this.defineValues(PlatformMovement, 'speed', 'jumpForce', 'jumpAcceleration', 'gravity', 'maxJumpTime')
  }

  onInitialize(): void {
    if (this.game.isClient()) {
      this.#controller = this.game.physics.world.createCharacterController(0.01)
    }

    this.listen(this.entity, EntityDestroyed, () => {
      if (this.#controller) this.game.physics.world.removeCharacterController(this.#controller)
    })
  }

  onTick(): void {
    if (!this.#controller) return

    const deltaTime = this.game.physics.tickDelta / 1000 // Convert to seconds

    let horizontalInput = 0
    if (this.#right.held) horizontalInput += 1
    if (this.#left.held) horizontalInput -= 1

    const horizontalVelocity = horizontalInput * this.speed

    // Jumping logic
    if (this.#jump.pressed && this.#isGrounded) {
      this.#verticalVelocity = this.jumpForce
      this.#jumpTimeCounter = 0
    }

    if (this.#jump.held && this.#jumpTimeCounter < this.maxJumpTime) {
      // Apply upward acceleration while the jump key is held
      this.#verticalVelocity += this.jumpAcceleration * deltaTime
      this.#jumpTimeCounter += deltaTime
    }

    // Create movement vector
    const movement = new Vector2(horizontalVelocity * deltaTime, this.#verticalVelocity * deltaTime)

    this.#controller.computeColliderMovement(this.#collider.collider, movement)
    const corrected = this.#controller.computedMovement()

    this.#isGrounded = this.#controller.computedGrounded()
    if (!this.#isGrounded) this.#verticalVelocity -= this.gravity * deltaTime

    this.entity.pos = this.entity.pos.add(corrected)
  }
}
