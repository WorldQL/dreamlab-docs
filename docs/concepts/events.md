# Events

Dreamlab's engine uses events to notify code of things happening in the game world.

There are several events built-in. Here are some examples and when they're emitted:

- Client only
  - `onRenderFrame`, a frame is rendered
- Server only
  - `onPlayerJoin`, a player connects
  - `onPlayerQuit`, a player disconnects
- Common (client and server)
  - `onInstantiate`, an entity is instantiated. Only used for camera, cursor, and the default player entities
  - `onSpawn`, an entity is spawned that was defined using `createSpawnableEntity`
  - `onDestroy`, an entity is destroyed and removed from the level

[You can view a full list of all built-in events and their payload types here](https://github.com/WorldQL/dreamlab-core/blob/trunk/src/events.ts).

## Custom Events

You can use custom events for any scenario in your game. For example, let's say you had an RPG with an "Ice Boss" monster and you wanted to give the player that delivered the final blow some XP.

```typescript
// write an interface to type your custom event
interface MyExampleGameEvents {
  // you can optionally prefix your event names to make sure they don't collide with other content
  "@MyGame/iceBossDeath": [lastHit: Player];
  "@MyGame/playerEarnedXP": [player: Player, amount: number];
}

// Declare a variable to represent your custom events.
const myEvents = game.events.custom as EventEmitter<MyExampleGameEvents>;

// Listen for the boss death event
myEvents.on("@MyGame/iceBossDeath", (player) => {
  // give the player 100 xp
  myEvents.emit("@MyGame/playerEarnedXP", player, 1000);
});

// Listen for the player earning XP event.
myEvents.on("@MyGame/playerEarnedXP", async (player, amount) => {
  // Update player's XP.
  // Events are great here because this requires async key-value DB operations
  
  let playerXP = amount;
  const oldXP = await kv.player(player.id).get("XP");
  if (oldXP) {
    playerXP += parseFloat(oldXP);
  }

  await kv.player(player.id).set("XP", xpReward);

  // Now we can update UI, etc...
});
```
