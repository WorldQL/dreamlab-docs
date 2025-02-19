# Dreamlab API Reference

# Handling Input
Handling user input, keypresses and mouse input
```typescript
import { Behavior, Vector2, syncedValue } from "@dreamlab/engine";
/*
  Handling Inputs in a Behavior:

  This example demonstrates how to set up and handle various inputs within a behavior using the `Inputs` class.
  Inputs are created for specific actions (e.g., movement or firing), and these actions are then checked and handled
  during the behavior's update cycle (`onTick`).

  Key Concepts:
  - **Input Creation:**
    Inputs are created using `this.inputs.create(...)`, binding a specific action to a key or mouse button.
    These inputs are stored in private fields and can be checked every frame to determine if the corresponding
    action should be executed.

  - **Input Handling:**
    Each frame, the behavior checks whether an input (e.g., a key or mouse button) is held down and executes
    the appropriate logic, such as moving an entity or firing a weapon.

  - **Cursor Tracking:**
    The `Inputs` class also provides cursor tracking, which allows the entity to rotate or aim based on the cursor's
    position in the game world.

  Below is the implementation of the `Movement` behavior that handles player movement and firing based on input.

*/

export default class Movement extends Behavior {
  @syncedValue()
  speed = 5.0;

  // Input bindings for movement
  // (method) Inputs.create(name: string, label: string, defaultBinding: Input): Action
  #up = this.inputs.create("@movement/up", "Move Up", "KeyW");
  #down = this.inputs.create("@movement/down", "Move Down", "KeyS");
  #left = this.inputs.create("@movement/left", "Move Left", "KeyA");
  #right = this.inputs.create("@movement/right", "Move Right", "KeyD");

  // Input binding for firing
  #fire = this.inputs.create("@clickFire/fire", "Fire", "MouseLeft");

  // Cooldown management for firing
  readonly #cooldown = 0;
  #lastFired = 0;

  velocity = Vector2.ZERO;

  onTick(): void {
    const movement = new Vector2(0, 0);
    const currentSpeed = this.speed;

    // Handle movement inputs
    if (this.#up.held) movement.y += 1;
    if (this.#down.held) movement.y -= 1;
    if (this.#right.held) movement.x += 1;
    if (this.#left.held) movement.x -= 1;

    // Calculate the velocity based on movement input and speed
    this.velocity = movement
      .normalize()
      .mul((this.game.physics.tickDelta / 100) * currentSpeed);

    // Update entity's position based on the input
    const newPosition = this.entity.transform.position.add(this.velocity);

    if (this.#fire.pressed) {
      // create a bullet
    }


    // look at cursor
    const cursorPosition = this.inputs.cursor.world;
    if (!cursorPosition) return;
    // EXTREMELY IMPORTANT: Use the value of this.inputs.cursor.world before applying newPosition to the transform
    const rotation = this.entity.transform.position.lookAt(cursorPosition);
    this.entity.transform.rotation = rotation;

    // Apply the new position to the entity
    this.entity.transform.position = newPosition;
  }
}

```

---

# Looking Up and Referencing Entities
Getting entities by ID or keeping track of entities associated with a behavior.
```typescript
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

```

---

# Detecting Collisions
Running code when one entity collides with another
```typescript
import {
  Behavior,
  Entity,
  EntityCollision,
  ColoredSquare,
} from "@dreamlab/engine";
import HealthBar from "./health-bar.ts"; // this import is not an api, the user will have to have or create a healthbar behavior for this example.
import PlayerBehavior from "./player.ts"; // this import is not an api, the user will have to have or create a player behavior for this example.

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
  private healthBar!: HealthBar;

  onInitialize(): void {
    const health = Math.floor(Math.random() * 3) + 3;
    this.healthBar = this.entity.addBehavior({
      type: HealthBar,
      values: { maxHealth: health, currentHealth: health },
    });

    // Listen for collision event
    // EntityCollision only has: (public started: boolean, public other: Entity)
    this.listen(this.entity, EntityCollision, (e: EntityCollision) => {
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

  // Another example of collision, in this example we change the color of its children ColoredSquare. This also works for ColoredPolygon
  // private onCollide(e: EntityCollision): void {
  //   // change wall color to balls color
  //   const wallSolidColor = e.other._.ColoredSquare;
  //   wallSolidColor.cast(ColoredSquare).color =
  //     this.entity._.ColoredSquare.cast(ColoredSquare).color;
  // }
}

```

---

# Handling Values
Updating the public variables associated with behaviors. These should be used to store state that can be inspected in the editor.
```typescript
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

```

---

# Message Channels and Key Value Database
Facilitating communication between behaviors using custom messages and synced values to synchronize state or trigger actions.
```typescript
import { Behavior, ClickableEntity, MouseDown, Sprite } from "@dreamlab/engine";

/*
  Custom Messages and Synced Values:

  In multiplayer game development, behaviors often need to communicate with each other to maintain
  consistency across the network. This can be achieved using custom messages or synced values.

  Key Points:
  - **Custom Messages:**
    Custom messages are event-driven and useful for sending specific data or triggering actions
    between behaviors. These messages are handled explicitly in the code, providing flexibility
    for dynamic interactions.

  - **Synced Values:**
    Synced values automatically synchronize data between the server and clients. They are ideal
    for maintaining shared states like scores, health, or leaderboard information. Using synced
    values reduces the complexity of managing data consistency manually.

  - **When to Use:**
    Use custom messages for one-time events or interactions, such as button clicks or attacks.
    Use synced values for persistent or frequently updated data that needs to remain consistent
    across the network.
*/

export default class ClickableColorChanger extends Behavior {
  #clickable: ClickableEntity;
  private isClicked = false;
  private effectTimer = 0;
  private originalScale = { x: 1, y: 1 };

  onInitialize(): void {
    this.#clickable = this.entity.cast(ClickableEntity);

    this.listen(this.#clickable, MouseDown, ({ button }) => {
      if (button !== "left") return;

      const player = this.game.network.connections.find(
        (conn) => conn.id === this.game.network.self
      );

      if (!player) return;

      this.game.network.sendCustomMessage("server", "@cookie/click", {
        playerId: player.playerId,
        nickname: player.nickname || "Unknown",
      });

      if (!this.isClicked) this.startClickEffect();
    });
  }

  private startClickEffect(): void {
    const sprite = this.entity._.Sprite.cast(Sprite);
    if (!sprite) return;

    this.isClicked = true;
    this.effectTimer = 150;

    this.originalScale = this.entity.transform.scale;
    sprite.alpha = 0.5;
    this.entity.transform.scale = {
      x: this.originalScale.x * 0.8,
      y: this.originalScale.y * 0.8,
    };
  }

  onTick(): void {
    if (this.isClicked) {
      const sprite = this.entity._.Sprite.cast(Sprite);
      if (!sprite) return;

      this.effectTimer -= this.time.delta;
      if (this.effectTimer <= 0) {
        sprite.alpha = 1;
        this.entity.transform.scale = this.originalScale;
        this.isClicked = false;
      }
    }
  }
}

import {
  Behavior,
  ObjectAdapter,
  PlayerJoined,
  syncedValue,
} from "@dreamlab/engine";
import { z } from "@dreamlab/vendor/zod.ts";

export default class GlobalStats extends Behavior {
  @syncedValue(ObjectAdapter)
  leaderboard: Record<string, { nickname: string; clicks: number }> = {};

  @syncedValue()
  totalClicks = 0;

  private playerClicks = new Map<
    string,
    { nickname: string; clicks: number }
  >();
  private playerIds = new Set<string>();

  async onInitialize() {
    if (!this.game.isServer()) return;

    const totalClicks = await this.game.kv.server.get("totalClicks");
    if (typeof totalClicks === "number") this.totalClicks = totalClicks;

    const savedPlayers = await this.game.kv.server.get("allPlayers");
    if (Array.isArray(savedPlayers)) {
      for (const { playerId, nickname } of savedPlayers) {
        const storedClicks = await this.game.kv.server.get(
          `playerClicks:${playerId}`
        );
        const clicks = typeof storedClicks === "number" ? storedClicks : 0;
        this.playerClicks.set(playerId, { nickname, clicks });
        this.playerIds.add(playerId);
      }
    }

    this.updateLeaderboard();

    this.listen(this.game, PlayerJoined, async (player) => {
      if (!this.game.isServer()) return;

      const playerId = player.connection.playerId;
      const nickname = player.connection.nickname || "Unknown";

      if (!this.playerIds.has(playerId)) {
        this.playerIds.add(playerId);
        await this.persistPlayer(playerId, nickname);
      }

      const storedClicks = await this.game.kv.server.get(
        `playerClicks:${playerId}`
      );
      const clicks = typeof storedClicks === "number" ? storedClicks : 0;

      this.playerClicks.set(playerId, { nickname, clicks });
      this.updateLeaderboard();
    });

    this.game.network.onReceiveCustomMessage((from, channel, data) => {
      if (channel !== "@cookie/click" || !this.game.isServer()) return;

      const ClickSchema = z.object({
        playerId: z.string(),
        nickname: z.string(),
      });
      const packet = ClickSchema.safeParse(data);
      if (!packet.success) return;

      const { playerId, nickname } = packet.data;

      this.totalClicks += 1;
      this.game.kv.server.set("totalClicks", this.totalClicks);

      const playerData = this.playerClicks.get(playerId) || {
        nickname,
        clicks: 0,
      };
      playerData.clicks += 1;
      this.playerClicks.set(playerId, playerData);

      this.game.kv.server.set(`playerClicks:${playerId}`, playerData.clicks);
      this.persistPlayer(playerId, nickname);

      this.updateLeaderboard();
    });
  }

  private async persistPlayer(playerId: string, nickname: string) {
    if (!this.game.isServer()) return;

    const allPlayersRaw = await this.game.kv.server.get("allPlayers");
    const allPlayers = Array.isArray(allPlayersRaw) ? allPlayersRaw : [];

    const updatedPlayers = [
      ...allPlayers.filter(
        (player) => typeof player === "object" && player.playerId !== playerId
      ),
      { playerId, nickname },
    ];

    await this.game.kv.server.set("allPlayers", updatedPlayers);
  }

  private updateLeaderboard() {
    this.leaderboard = Object.fromEntries(this.playerClicks.entries());
  }
}

```

---

# Handling Transforms
Moving, scaling, and rotating objects
```typescript
// Example of changing an entities position through a behavior. This one is more basic.
import { Behavior, Vector2, syncedValue } from "@dreamlab/engine";

/*
  Key Points:
  - **Basic Movement:** Calculate the new position by adding a direction vector to the current position.
  - **Transform Properties:** Use properties like `position`, `rotation`, and `scale` to control entity movement and appearance.

  This example moves an asteroid in a random direction at a constant speed.
*/
export default class AsteroidMovement extends Behavior {
  readonly #direction = new Vector2(
    Math.random() * 2 - 1,
    Math.random() * 2 - 1
  ).normalize();

  @syncedValue()
  speed = 0.2;

  /*
  Properties available under entity.transform are:
  - scale.x, scale.y
  - position.x, position.y
  - entity.transform.z (used for zIndex ordering)
  - entity.transform.rotation (radians)
  */

  onTick(): void {
    this.entity.transform.position = this.entity.transform.position.add(
      this.#direction.mul((this.time.delta / 100) * this.speed)
    );
  }
}

// Example of moving an entity based on another entities position. A more advanced example
import { Behavior, Collider, Sprite } from "@dreamlab/engine";
import BulletBehavior from "./bullet.ts"; // this import is not an api, the user will have to make this behavior for this example

export default class EnemyMovement extends Behavior {
  speed = Math.random() * 0.5 + 0.5;
  minDistance = 5;
  shootDistance = 10;
  lastShootTime = 0;
  shootCooldown = Math.random() * 2000 + 1000;

  onTick(): void {
    // Find the player entity
    const player = this.entity.game.world.children.get("Player");
    const playerPos = player?.globalTransform.position;
    if (!playerPos) return;

    const direction = playerPos.sub(this.entity.transform.position).normalize();
    const distance = playerPos.sub(this.entity.transform.position).magnitude();

    // In this example we only move the entity towards the player if they are outside a certain distance
    if (distance > this.minDistance + 5) {
      let speedFactor = 1;
      if (distance < this.minDistance + 10) {
        speedFactor = (distance - this.minDistance) / 10;
      }
      this.entity.transform.position = this.entity.transform.position.add(
        direction.mul((this.time.delta / 100) * this.speed * speedFactor)
      );
    }

    // Adjust rotation of entity so its facing the correct direction
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

    this.entity.game.world.spawn({
      type: Collider,
      name: "EnemyBullet",
      transform: {
        position: this.entity.transform.position.clone(),
        rotation,
        scale: { x: 0.25, y: 0.25 },
      },
      behaviors: [{ type: BulletBehavior, values: { speed: 8 } }],
      children: [
        {
          type: Sprite,
          name: "BulletSprite",
          transform: {
            scale: { x: 0.75, y: 0.75 },
          },
        },
      ],
    });
  }
}

```

---

# Spawning Entities
Spawning new entities into the world and attaching behaviors.
```typescript
import { Behavior, Collider, Sprite } from "@dreamlab/engine";
import BulletBehavior from "./bullet.ts"; // this import is not an API, the user will need to make this behavior

/*
  Spawning Entities Overview:

  There are multiple ways to spawn entities in the game using the "@dreamlab/engine" package.
  Each method is suitable for different scenarios, depending on your needs.

  1. **Cloning a Prefab:**
     - This method is ideal for spawning predefined entities, such as players or enemies, that have been set up as prefabs.
     - You can clone a prefab into the world and customize its properties (e.g., name, position, authority).

     Example:
     this.game.prefabs._.Player.cloneInto(this.game.world, {
       name: "Player." + this.game.network.self,
       transform: { position: { x: 0, y: 0 } },
       authority: this.game.network.self,
     });


  2. **Spawning from Scratch:**
     - For more complex entities that may not have a predefined prefab, you can spawn them directly by defining their components and behaviors in the spawn call.
     - This method allows you to create fully customized entities on the fly.

     Example:
     this.entity.game.world.spawn({
       type: RectCollider,
       name: "EnemyBullet",
       transform: {
         position: this.entity.transform.position.clone(),
         rotation,
         scale: { x: 0.25, y: 0.25 },
       },
       behaviors: [{ type: BulletBehavior, values: { speed: 8 } }],
       children: [
         {
           type: Sprite,
           name: "BulletSprite",
           transform: {
             scale: { x: 0.75, y: 0.75 },
           },
         },
       ],
     });

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
        direction.mul((this.time.delta / 100) * this.speed * speedFactor)
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

    // Spawning a bullet entity with custom transform, behaviors, and children entities
    this.entity.game.world.spawn({
      type: Collider,
      name: "EnemyBullet",
      transform: {
        position: this.entity.transform.position.clone(),
        rotation,
        scale: { x: 0.25, y: 0.25 },
      },
      behaviors: [{ type: BulletBehavior, values: { speed: 8 } }],
      children: [
        {
          type: Sprite,
          name: "BulletSprite",
          transform: {
            scale: { x: 0.75, y: 0.75 },
          },
        },
      ],
    });
  }
}

```

---

# Vector2 API
Essential vector operations like addition, subtraction, and normalization using Vector2.
```typescript
// Vector2 is a common class in Dreamlab
import { Vector2, IVector2 } from "@dreamlab/engine";

// example use
const v: IVector2 = {x:0, y:0}
const myVector: Vector2 = new Vector2(v)


interface IVector2 {
  x: number;
  y: number;
}

// It has the following methods.
class Vector2 {
  // Constants
  static ZERO: Vector2    // (0, 0)
  static ONE: Vector2     // (1, 1) 
  static NEG_ONE: Vector2 // (-1, -1)
  static X: Vector2       // (1, 0)
  static Y: Vector2       // (0, 1)
  static NEG_X: Vector2   // (-1, 0)
  static NEG_Y: Vector2   // (0, -1)

  // Properties
  x: number
  y: number

  // Constructors
  constructor(x: number, y: number)
  constructor(vector: IVector2)
  
  // Static Methods
  static splat(value: number): Vector2                    // Creates vector with all elements set to value
  static eq(a: IVector2, b: IVector2): boolean           // Compare equality
  static abs(vector: IVector2): Vector2                  // Absolute values
  static neg(vector: IVector2): Vector2                  // Negate values
  static inverse(vector: IVector2): Vector2              // 1/value for each component
  static add(a: IVector2, b: IVector2): Vector2         // Add vectors
  static sub(a: IVector2, b: IVector2): Vector2         // Subtract vectors
  static mul(a: IVector2, b: IVector2|number): Vector2  // Multiply by vector or scalar
  static div(a: IVector2, b: IVector2|number): Vector2  // Divide by vector or scalar
  static magnitude(vector: IVector2): number            // Length of vector
  static magnitudeSquared(vector: IVector2): number     // Squared length
  static normalize(vector: IVector2): Vector2           // Convert to unit vector
  static lookAt(vector: IVector2, target: IVector2): number  // Get angle to target
  static lerp(a: IVector2, b: IVector2, t: number): Vector2 // Linear interpolation
  static smoothLerp(current: IVector2, target: IVector2, decay: number, deltaTime: number, epsilon?: number): Vector2
  static distance(a: IVector2, b: IVector2): number     // Distance between vectors
  static distanceSquared(a: IVector2, b: IVector2): number  // Squared distance
  static max(a: IVector2, b: IVector2): Vector2        // Component-wise maximum
  static min(a: IVector2, b: IVector2): Vector2        // Component-wise minimum
  static rotate(vector: IVector2, angle: number): Vector2    // Rotate vector
  static rotateAbout(vector: IVector2, angle: number, point: IVector2): Vector2  // Rotate around point
  static dot(a: IVector2, b: IVector2): number         // Dot product

  // Instance Methods
  clone(): Vector2                    // Create copy
  bare(): IVector2                    // Get raw x,y object
  assign(value: Partial<IVector2>): boolean  // Update components
  eq(other: IVector2): boolean
  abs(): Vector2
  neg(): Vector2
  inverse(): Vector2
  add(other: IVector2): Vector2
  sub(other: IVector2): Vector2
  mul(other: IVector2|number): Vector2
  div(other: IVector2|number): Vector2
  magnitude(): number
  magnitudeSquared(): number
  normalize(): Vector2
  lookAt(target: IVector2): number
  distance(other: IVector2): number
  distanceSquared(other: IVector2): number
  max(other: IVector2): Vector2
  min(other: IVector2): Vector2
  rotate(angle: number): Vector2
  rotateAbout(angle: number, point: IVector2): Vector2
  dot(other: IVector2): number
}
```

---

# Character Controller
Using the built-in character controller which handles collision detection. Great for any movement style.
```typescript
// This is an example of how to implement a platformer controller using the CharacterController
import {
  Behavior,
  CharacterController,
  RichText,
  Vector2,
  syncedValue,
} from "@dreamlab/engine";

// A very simple platformer controller

export default class PlayerController extends Behavior {
  #controller = this.entity.cast(CharacterController);

  @syncedValue() speed = 10;
  @syncedValue() jumpForce = 20;
  @syncedValue() jumpAcceleration = 40;
  @syncedValue() gravity = 90;
  @syncedValue() maxJumpTime = 1; // Maximum duration the jump key affects the jump

  @syncedValue() points = 0;

  #verticalVelocity = 0;
  #jumpTimeCounter = 0;

  #left = this.inputs.create("@movement/left", "Move Left", "KeyA");
  #right = this.inputs.create("@movement/right", "Move Right", "KeyD");
  #jump = this.inputs.create("@movement/jump", "Jump", "Space");

  onInitializeClient() {
    if (!this.hasAuthority()) return;
    this.values.get("points")?.onChanged((newPoints: number) => {
      this.game.local!._.CoinCounter.cast(RichText).text = "Coins: " + newPoints;
    });
  }

  onTickClient(): void {
    if (!this.hasAuthority()) return;

    const deltaTime = this.game.physics.tickDelta / 1_000; // Convert to seconds

    let horizontalInput = 0;
    if (this.#right.held) horizontalInput += 1;
    if (this.#left.held) horizontalInput -= 1;

    const horizontalVelocity = horizontalInput * this.speed;

    // Jumping logic
    if (this.#jump.pressed && this.#controller.isGrounded) {
      this.#verticalVelocity = this.jumpForce;
      this.#jumpTimeCounter = 0;
    }

    if (this.#jump.held && this.#jumpTimeCounter < this.maxJumpTime) {
      // Apply upward acceleration while the jump key is held
      this.#verticalVelocity += this.jumpAcceleration * deltaTime;
      this.#jumpTimeCounter += deltaTime;
    }

    // Create movement vector
    const movement = new Vector2(
      horizontalVelocity * deltaTime,
      this.#verticalVelocity * deltaTime,
    );

    if (!this.#controller.isGrounded) this.#verticalVelocity -= this.gravity * deltaTime;

    this.entity.pos = this.entity.pos.add(movement);
  }
}

```

---

# User Interfaces
Creating GUIs (HUDs, health bars, etc)
```typescript
import { Behavior, UILayer, syncedValue } from "@dreamlab/engine";
import { element } from "@dreamlab/ui";

/*
  UI System Overview:

  The UI system in this project allows you to create and manage user interface elements
  dynamically within the game using the `element` method from the "@dreamlab/ui" package.

  - **Creating Elements:**
    You can create HTML elements by calling the `element` function, which takes the
    element's tag name, an object with properties/attributes, and an array of child elements or text.

  - **Appending to the UI Layer:**
    Once created, elements are appended to the UI layer of an entity, making them visible
    in the game's UI. This is typically done by accessing the `UILayer` component
    of the current entity and using `appendChild` to add elements.

  - **Event Handling:**
    You can attach event listeners to UI elements, such as buttons, to handle user interactions.
    This allows you to create responsive and interactive UIs within the game.

  - **Example Usage:**
    In the example below, a "Death Screen" UI is created, which displays a game over message,
    the player's final score, and a button to respawn the player. The UI is dynamically created
    when the player dies and removed when they respawn.

    - The `element` method is used to create the UI elements.
    - CSS styling is applied by creating a `<style>` element.
    - The UI is integrated into the game's UI layer, ensuring it appears on the screen.

  - **Best Practices:**
    - Ensure to clean up any UI elements when they are no longer needed to avoid memory leaks.
    - Use descriptive IDs and class names to maintain clarity in your UI components.
    - Keep UI logic modular by separating the creation and management of UI elements into different methods.

  Below is an example implementation of a death screen using this UI system.
*/

export default class DeathScreen extends Behavior {
  // Reference to the UI layer associated with the entity
  #ui = this.entity.cast(UILayer);
  #element!: HTMLDivElement;

  @syncedValue()
  score = 0;

  onInitialize() {
    // CSS for the death screen UI element
    const css = `
    #death-screen {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      color: white;
      background: rgb(0 0 0 / 85%);
      font-family: "Inter", sans-serif;
    }

    h1 {
      font-size: 3rem;
      font-weight: bold;
      margin-bottom: 0;
    }

    p {
      font-size: 1.5rem;
      margin-bottom: 1rem;
    }

    button {
      padding: 1rem 2rem;
      font-size: 1.5rem;
      cursor: pointer;
      border: none;
      border-radius: 0.4rem;
      color: white;
      background-color: #ff6600;
      transition: background-color 0.3s ease;
    }

    button:hover {
      background-color: #e65c00;
    }
    `;

    // Create a <style> element and add the CSS to it
    const style = element("style", { textContent: css });
    this.#ui.dom.appendChild(style);

    // Create a "Respawn" button using the new `element` method
    const button = element("button", { type: "button" }, ["Respawn"]);
    button.addEventListener("click", () => this.#respawnPlayer());

    // Create the main death screen UI container
    this.#element = element(
      "div",
      {
        id: "death-screen", // Set the ID for the main container
      },
      [
        // Add an <h1> element for the "Game Over" title
        element("h1", { className: "example-classname" }, ["Game Over"]),

        // Add a <p> element to display the player's final score
        element("p", {}, [`Final Score: ${this.score.toLocaleString()}`]),

        // Add the "Respawn" button created earlier
        button,
      ]
    );

    // Append the death screen UI container to the UI layer
    this.#ui.element.appendChild(this.#element);
  }

  #respawnPlayer() {
    // spawnPlayer(this.game)

    // Destroy the current entity, removing the death screen from the UI
    this.entity.destroy();
  }
}

```

---

# Interacting with Behaviors
Fetching other behaviors attached to an entity.
```typescript
import {
  Behavior,
  Entity,
  EntityCollision,
  ColoredSquare,
} from "@dreamlab/engine";
import PlayerBehavior from "./player.ts"; // this import is not an api, the user will have to have or create a player behavior for this example.

/*
  Example: Using `getBehavior()` to Access Behaviors

  The `getBehavior()` method allows you to retrieve an existing behavior attached to an entity.
  This is particularly useful when you need to interact with or update a behavior that has already been set up,
  such as a health bar or UI component, without needing to instantiate it again.

  In this example, `getBehavior()` is used to update the player's score when an asteroid is destroyed,
  as well as to interact with the asteroid's health bar.

  Accessing entity children:
  Use `this.entity._.ChildName` to access a child entity directly. 
  For example: `this.entity._.ColoredSquare` will work if the entity has a child named 'ColoredSquare'.

  If the child's name contains a space, use bracket notation: `this.entity._["My_Entity"]`.

  You can also access children of children by chaining: 
  `this.entity.myChild.myOtherChild`.

  Important: 
  Do NOT use `this.entity.children.find(child => child.name === "ChildName")` as it is inefficient and unnecessary. 
  The `children` property provides a `ReadonlyMap` for reference but should not be used for lookups.

  Benefits of `getBehavior()`:
  - Prevents duplication of behavior instances.
  - Allows direct access to existing behaviors for updates or interactions.
  - Ensures that only one instance of the behavior is manipulated, maintaining consistency.
*/

export default class AsteroidBehavior extends Behavior {
  onInitialize(): void {
    this.listen(this.entity, EntityCollision, (e) => {
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

// Health bar behavior for reference
import {
  GamePostTick,
  Sprite,
  Vector2,
  syncedValue,
} from "@dreamlab/engine";

export default class HealthBar extends Behavior {
  @syncedValue()
  maxHealth = 100;

  @syncedValue()
  currentHealth = 100;

  healthBarEntity!: Entity;

  onInitialize(): void {
    this.healthBarEntity = this.game.world.spawn({
      type: Sprite,
      name: "HealthBar",
      transform: { position: { x: 0, y: 1, }, scale: { x: 1, y: 0.1 } },
      values: { texture: "res://assets/healthbar.png" },
    });

    this.game.on(GamePostTick, () => {
      this.healthBarEntity.pos = this.entity.pos.add(new Vector2(0, 1));
      this.updateHealthBar();
    });
  }

  updateHealthBar(): void {
    const healthRatio = this.currentHealth / this.maxHealth;
    this.healthBarEntity.transform.scale.x = healthRatio;
  }

  takeDamage(damage: number): void {
    this.currentHealth -= damage;
    if (this.currentHealth <= 0) {
      this.currentHealth = 0;
      this.entity.destroy();
      this.healthBarEntity.destroy();
      this.spawnExplosionPieces();
    }

    this.updateHealthBar();
  }

  spawnExplosionPieces(): void {
    const pieceCount = Math.random() * 5 + 3;
    const pieceSize = { x: 0.15, y: 0.15 };

    for (let i = 0; i < pieceCount; i++) {
      this.entity.game.world.spawn({
        type: Sprite,
        name: "ExplosionPiece",
        transform: {
          position: this.entity.transform.position.clone(),
          scale: pieceSize,
        },
        behaviors: [],
        children: [
          {
            type: Sprite,
            name: "PieceSprite",
            values: { texture: "res://assets/asteroid.png" },
          },
        ],
      });
    }
  }
}

```

---

# Basic Structure
Behavior classes are used to implement all game functionality.
```typescript
import {
  Behavior,
  Vector2,
  Vector2Adapter,
  syncedValue,
  ColoredSquare,
} from "@dreamlab/engine";
/*
  In "@dreamlab/engine", a `Behavior` represents a modular piece of logic that can be attached to an entity.
  This allows you to encapsulate functionality, such as movement, health management, or AI, in reusable components.

  Key Components:
  - **Lifecycle Methods:**
    - `onInitialize`: Called once when the behavior is first attached to an entity, used for setup tasks.
    - `onTick`: Called on every game tick, ideal for updating logic like movement or state changes.
    - `onPreTick`, `onPostTick`, `onFrame`: Additional lifecycle hooks for more granular control over update timing.

  - **Values:** Behaviors can have properties (values) that are synchronized across the network or exposed to
    an inspector GUI. These values are defined using `defineValue` or `defineValues` methods and can be of various
    types, including primitives and complex types with adapters.

  - **Signals:** Behaviors can listen for signals (events) from the game or other entities and respond accordingly.
    This is done using the `listen` method for subscribing to signals, and `fire` to emit them.

  - **Destruction:** Behaviors can be destroyed manually using `destroy()` or automatically via the entity lifecycle.
    This cleanup process ensures all listeners and values are properly disposed of.

  The `Behavior` class is highly flexible, supporting complex game mechanics through a combination of values, signals,
  and lifecycle hooks. It serves as the foundation for defining how entities behave in the game world.

  Accessing entity children:
  Use `this.entity._.ChildName` to access a child entity directly. 
  For example: `this.entity._.ColoredSquare` will work if the entity has a child named 'ColoredSquare'.

  If the child's name contains a space, use bracket notation: `this.entity._["My_Entity"]`.

  You can also access children of children by chaining: 
  `this.entity.myChild.myOtherChild`.

  Important: 
  Do NOT use `this.entity.children.find(child => child.name === "ChildName")` as it is inefficient and unnecessary. 
  The `children` property provides a `ReadonlyMap` for reference but should not be used for lookups.

  Important Notes:
  - **Do Not Use Renderer for Game Screen Dimensions:**
    The game screen is defined by the camera(s) in the game scene, not by the renderer or app.
    Attempting to access `this.game.renderer.app.screen.width` or `this.game.renderer.app.screen.height` is incorrect.
    To limit game space or define boundaries, use colliders (e.g., walls) in the world.
    Avoid relying on renderer properties as they do not exist on `game` and are unrelated to defining game space.

*/

// example Behavior that allows for WASD movement as well as a pattern for firing projectiles.
// this serves as an example for the general structure of a behavior
export default class Movement extends Behavior {
  // the speed of the player
  @syncedValue()
  speed = 5.0;

  // example value
  @syncedValue()
  anotherValue = 42.0;

  // the current velocity of the player
  @syncedValue(Vector2Adapter)
  velocity = Vector2.ZERO;

  // Input bindings for movement
  // (method) Inputs.create(name: string, label: string, defaultBinding: Input): Action
  #up = this.inputs.create("@movement/up", "Move Up", "KeyW");
  #down = this.inputs.create("@movement/down", "Move Down", "KeyS");
  #left = this.inputs.create("@movement/left", "Move Left", "KeyA");
  #right = this.inputs.create("@movement/right", "Move Right", "KeyD");

  onInitialize(): void {
    // if you want to disable/enable an entity (useful for hiding and showing things), simply use
    this.entity.enabled = false;
  }

  onTick(): void {
    const movement = new Vector2(0, 0);
    const currentSpeed = this.speed;

    if (this.#up.held) movement.y += 1;
    if (this.#down.held) movement.y -= 1;
    if (this.#right.held) movement.x += 1;
    if (this.#left.held) movement.x -= 1;

    this.velocity = movement
      .normalize()
      .mul((this.game.physics.tickDelta / 100) * currentSpeed);

    const newPosition = this.entity.transform.position.add(this.velocity);
  }
}

```

---


You are an AI coding agent integrated into a video game engine. Your task is to generate or modify code based on the provided context, documentation, and instructions. Follow these steps carefully:

These documentation above should be used for all requests.

Some additional notes:
- You may use TypeScript's regular setTimeout()
- Do not hardcode entity lookups, use EntityByRef on a @syncedValue which allows to user to assign entity relationships by dragging and dropping in the editor.
- In Dreamlab, the x direction is to the right and the y direction is up.

2. Before writing any code, analyze the inputs and plan your approach. Outline your thought process, considering the following:
   - How the new code will integrate with the existing codebase
   - Any potential conflicts or dependencies
   - The most efficient way to implement the requested features
   - How to maintain consistency with the game engine's coding style and best practices

3. After your analysis, generate the code for the file. Ensure that your code:
   - Follows the file instructions precisely
   - Integrates seamlessly with the existing codebase
   - Adheres to the coding standards demonstrated in the context files and code samples
   - Is well-commented and easy to understand
   - Implements error handling and considers edge cases
   - When importing code, always include the .ts extension.
   - Is a complete implementation.

4. If you're modifying an existing file, return the entire new file.

5. Only include the code for the single file you're asked about. Any changes to other files will be made later.

6. When you need to reference another entity, always use \`@syncedValue(EntityRef) public myEntity: Entity | undefined;\`

7. Do not use any node.js imports.

8. If you want to provide a drop-down menu of options, use the following syntax:
const MyShapeOptions = ["Rectangle", "Circle"] as const;
type MyShapeOptions = (typeof ColliderShape)[number];
// then in your entity
import { optionsAdapter } from "@dreamlab/engine";
@syncedValue(optionsAdapter(MyShapeOptions))

9. Think carefully about what APIs you need to import. Do not use any methods or imports not explicitly mentioned.

10. When comparing the position of two entities, always use .pos (which is shorthand for .globalTransform.position) to compare them.
Transform.position is relative to parent. .pos is absolute position in the world.

11. Never include project.json.

12. When writing UI, always `import { element as elem } from "@dreamlab/ui";`


When answering, be sure to think about:
1. Carefully consider whether you want your code running on the server or client.
2. If you want server authority, run in onTickServer. If it's client-only, run in onTickClient. If it has anything to do with player control, you probably want to tick on the client.

Additionally, think about what methods you are going to use/import. Only use methods that exist from other files or the Dreamlab API. Plan for everything you're going to need to do and what you have to import. If you need any sort of game engine feature, list it in your response and where it's going to be imported from. Do not invent new APIs.

Then output your code after thinking.

EXTREMELY IMPORTANT: When relevant, please create a file called ".<brief-description-of-your-changes>.instructions.txt" which explains in plain language what type of entity your script should be attached to, etc.
To create that file, please ensure "./scene-description.md" is loaded to see the scene. For example:
1. The user requested a new enemy. You wrote a script assuming it will be attached to a Collider and a script to spawn it on regular intervals.
2. You look in scene-description.md and see there is no enemy prefab with the script attached already.
3. You write to ".new-enemy.instructions.txt": "In prefabs, create a Collider named "Enemy" with a SolidColor child that is red and attach ./src/enemy-script-i-just-wrote.ts. Then, in world create an Empty named "EnemySpawner" and attach "./src/enemy-spawner.ts and set the "enemyToSpawn" value to `game.prefabs._.Enemy`"
4. Always create a fresh file which is named appropriately.

Notes:
1. Entities cannot change type.
2. Entities do not have components. They are a single entity of a single type. Here is a list of all entities:
- Sprite
- AnimatedSprite
- TilingSprite
- ColoredPolygon
  - Has a set number of sides. If you want to make a circle set this to 20.
- ColoredSquare
  - color: '#hexstring'
  - Their position is the center of the rectangle. Take this into account when positioning.
- Clickable
- Collider
- CharacterController
  - A collider that will attempt to track position set but will stop at other colliders. Useful if you want a player that is stopped by walls.
- Empty
- Camera
- AudioSource
- RawPixi
- UILayer
- UIPanel
- Text

If you're simply modifying an existing script, this will not be needed.

Feel free to ask the user questions before answering if you feel you do not have enough detail.