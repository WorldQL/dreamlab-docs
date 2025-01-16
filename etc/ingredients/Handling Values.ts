import {
  Behavior,
  Vector2,
  Vector2Adapter,
  syncedValue,
} from "@dreamlab/engine";

/*
  Handling Values in Behaviors:

  In "@dreamlab/engine", values within behaviors are critical for maintaining and synchronizing
  the state across the network. Values can represent anything from simple properties like speed
  or health to more complex game states.

  Key Points:
  - **Defining Values:**
    Values are defined using the `defineValues` decorator, which binds a property
    to the behavior, ensuring it is properly managed and optionally synchronized across the network.

  - **Value Synchronization:**
    By default, values are local to the behavior, but they can be set to replicate across
    the network by configuring the `opts.replicated` option when defining a value.

  - **Accessing Values:**
    Once defined, values can be accessed and modified like any other property. However,
    they are wrapped in a `Value` object that manages synchronization, type checking,
    and default values.

  - **Using Adapters for Complex Values:**
    If your synced value requires additional processing or conversion, you must use an adapter.
    Below are examples of adapters and their usage:

    - **Vector2Adapter:** For vector data, like positions or velocities.
      @syncedValue(Vector2Adapter)
      velocity = Vector2.ZERO;
      

    - **TextureAdapter:** For textures that need preloading.
      @syncedValue(TextureAdapter)
      texture = "path/to/texture.png";
      

    - **SpritesheetAdapter:** For spritesheets requiring preloading.
      @syncedValue(SpritesheetAdapter)
      spritesheet = "path/to/spritesheet.json";
      

    - **ObjectAdapter:** For synchronizing plain objects with mutation detection.
      @syncedValue(ObjectAdapter)
      config = { key: "value" };
      

    - **EntityByRefAdapter:** For referencing game entities.
      @syncedValue(EntityByRefAdapter)
      targetEntity = undefined;
      

    - **ColorAdapter:** For color values.
      @syncedValue(ColorAdapter)
      color = "#FFFFFF";
      

    - **AudioAdapter:** For preloading audio resources.
      @syncedValue(AudioAdapter)
      audio = "path/to/sound.mp3";
      

  Below is an example demonstrating how to define and use values within a behavior.
*/

export default class PlayerMovement extends Behavior {
  /*
    Define a synced value for the player's speed
    - The `defineValues` method is used to specify which properties should be treated as values.
    - Once defined, `speed` will be managed by the internal value system, allowing it to be
      synchronized across the network if needed.
  */
  @syncedValue()
  speed = 5.0;

  /*
    Define a synced value for velocity using the Vector2Adapter
    - This ensures that the `velocity` property can handle vector data correctly
      and synchronize it across the network if needed.
  */
  @syncedValue(Vector2Adapter)
  velocity = Vector2.ZERO;

  #up = this.inputs.create("@movement/up", "Move Up", "KeyW");
  #down = this.inputs.create("@movement/down", "Move Down", "KeyS");
  #left = this.inputs.create("@movement/left", "Move Left", "KeyA");
  #right = this.inputs.create("@movement/right", "Move Right", "KeyD");
  #boost = this.inputs.create("@movement/boost", "Speed Boost", "ShiftLeft");

  onTick(): void {
    // Ensure that only the entity's owner can control it
    if (this.hasAuthority()) return;

    const movement = new Vector2(0, 0);

    if (this.#up.held) movement.y += 1;
    if (this.#down.held) movement.y -= 1;
    if (this.#right.held) movement.x += 1;
    if (this.#left.held) movement.x -= 1;

    // Adjust speed if boost is held
    let currentSpeed = this.speed;
    if (this.#boost.held) currentSpeed *= 2;

    const velocity = movement
      .normalize()
      .mul((this.game.physics.tickDelta / 100) * currentSpeed);

    this.entity.transform.position =
      this.entity.transform.position.add(velocity);
  }
}
