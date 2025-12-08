import RAPIER from "@dreamlab/vendor/rapier.ts";

// in your tick or wherever needed
let ray = new RAPIER.Ray({ x: 1.0, y: 2.0 }, { x: 0.0, y: 1.0 }); // direction of ray
let rayDistance = 4.0;
let solid = true; // hit inside of object if cast inside object, otherwise only treat walls as solid

this.game.physics.world.castRay(
  leftRay,
  rayDistance,
  solid,
  undefined,
  undefined,
  // ignore a specific collider
  this.entity.cast(CharacterController).collider,
  undefined,
  // or write a filter, this one ignores the left wall
  (collider) => {
    const entity = this.game.entities.lookupByRef(collider.userData.entityRef);
    if (entity && entity.name === "LeftWall") return false;
    return true;
  },
);

// undefined positional arguments above are less common filter methods.

// when raycasting from a player, you MUST filter out the player.

if (hit) {
  const hitEntity: Entity = this.game.entities.lookupByRef(result!.collider.userData.entityRef)!;
}
