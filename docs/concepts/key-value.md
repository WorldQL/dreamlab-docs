# Saving Data

Key/value storage for your game makes it easy to persist data about players and the game world.

Suppose you want to implement an XP system for an RPG.

```js
function onPlayerKilledMob() {
    await kv.world.set(KV_KEY, newGlobalPlays.toString())
}
```