import { Behavior, ColoredSquare } from "@dreamlab/engine";
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

  Accessing entity children:
  Use `this.entity._.ChildName` to access a child entity directly. 
  For example: `this.entity._.ColoredSquare` will work if the entity has a child named 'ColoredSquare'.

  If the child's name contains a space, use bracket notation: `this.entity._["My_Entity"]`.

  You can also access children of children by chaining: 
  `this.entity.myChild.myOtherChild`.

  Important: 
  Do NOT use `this.entity.children.find(child => child.name === "ChildName")` as it is inefficient and unnecessary. 
  The `children` property provides a `ReadonlyMap` for reference but should not be used for lookups.

    Accessing synced values in Dreamlab:

  1. **Entity synced values**:
     To access a synced value from an entity, use the `cast` method to cast the entity's child to its specific type.
     Example:
     private onCollide(e: EntityCollision): void {
       // Change the wall's color to match the ball's color
       // Color is a HEX value only in a String
       const wallSolidColor = e.other._.ColoredSquare;
       wallSolidColor.cast(ColoredSquare).color =
         this.entity._.ColoredSquare.cast(ColoredSquare).color;
     }
     

     - `cast` ensures you access the correct type, allowing you to manipulate its synced values safely.
     - This is essential when interacting with child entities or components that expose synced values.

  2. **Behavior synced values**:
     To access synced values within a behavior, use the `getBehavior` method to retrieve the behavior instance attached to an entity.
     Example:
     onCollide(other: Entity) {
       if (!other.name.startsWith("Bullet")) return;

       other.destroy();
       this.healthBar.takeDamage(1);
       if (this.healthBar.currentHealth <= 0) {
         const player = this.entity.game.world._.Player;
         player.getBehavior(PlayerBehavior).score += 100;
       }
     }
     

     - `getBehavior` retrieves the behavior instance where the synced value is defined, allowing direct access to it.
     - Use this method for behaviors instead of `getComponent`.

  **Important**:
  - Do NOT use `getComponent` for accessing synced values. It is less efficient and not recommended.
  - Ensure type safety by using `cast` for entity properties and `getBehavior` for behavior-specific values.
*/

export default class PlayerSpawner extends Behavior {
  onInitialize(): void {
    if (!this.game.isClient()) return;

    this.game.prefabs._.Player.cloneInto(this.game.world, {
      name: "Player." + this.game.network.self,
      transform: { position: { x: 0, y: 0 } },
      authority: this.game.network.self,
    });

    this.game.local._.Camera.transform.scale.assign({ x: 2, y: 2 });
  }
}
