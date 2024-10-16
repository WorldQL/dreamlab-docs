import { Behavior } from '@dreamlab/engine'
/*
  You can look up entities by their ID using the various roots (prefabs, local, world, & server).
  Each root contains a collection of entities, and you can access a specific entity by its ID
  using the following syntax: `this.game.root._.MyEntityID`.

  Example:
  Suppose you have an entity with the ID "Player" in the prefabs root and another with the ID "MainCamera" in the local root.

  - To retrieve the Player entity from the prefabs root:
    const playerEntity = this.game.prefabs._.Player;

  - To retrieve the MainCamera entity from the local root:
    const cameraEntity = this.game.local._.MainCamera;

  These entities can then be manipulated directly. For example:
  playerEntity.transform.position.assign({ x: 10, y: 5 });
  cameraEntity.transform.scale.assign({ x: 1.5, y: 1.5 });
*/

export default class PlayerSpawner extends Behavior {
  onInitialize(): void {
    if (!this.game.isClient()) return

    this.game.prefabs._.Player.cloneInto(this.game.world, {
      name: 'Player.' + this.game.network.self,
      transform: { position: { x: 0, y: 0 } },
      authority: this.game.network.self,
    })

    this.game.local._.Camera.transform.scale.assign({ x: 2, y: 2 })
  }
}
