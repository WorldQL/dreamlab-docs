# Behaviors

Behaviors are how you implement logic into your game. A behavior is a script file written in TypeScript that are
attached to [Entities](./Entities.mdx). If you are familiar with Unity then these are conceptually similar to
MonoBehaviors, or Scripts in Godot.

Behaviors can implement various ["lifecycle" methods](#lifecycle-methods) that the engine will run automatically, such
as the `onTick()` method which gets called every engine tick (60 TPS by default).

All behaviors also have access to some global properties (such as `.entity`) which let them interact with the game
state. You can also define your own properties as [synced values](./Synced-Values-and-Adapters.mdx) to automatically
sync them over the network, as well as make them available in the Dreamlab Editor.

:::info Marking a behavior property as a synced value is similar to the `[SerializeField]` annotation in Unity or the
`@export` annotation in Godot, with the added benefit of enabling automatic network syncing. :::

## Defining a Behavior

Behavior script files must have a class that extends `Behavior` as the default export. Only the default export is
required, other exports are allowed. Script files must also be inside the `src` folder of the project root. Scripts
inside sub-folders of `src` are also allowed.

```ts
import { Behavior } from "@dreamlab/engine";

export default class MyBehavior extends Behavior {
  // ...
}
```

### Properties

| Property | Description                                    |
| -------- | ---------------------------------------------- |
| `game`   | The current game instance                      |
| `entity` | The entity this behavior is attached to        |
| `time`   | Game time info (current time, delta time, etc) |
| `inputs` | Input manager                                  |

### Lifecycle Methods

:::info Not all methods are documented here. Some have specialized use cases and aren't generally useful in most cases.
:::

| Method           | When it is run                                                             | Use case                           |
| ---------------- | -------------------------------------------------------------------------- | ---------------------------------- |
| `onInitialize()` | When a behavior is initialized (created or attached to an existing entity) | Running initialization code        |
| `onTick()`       | Every game tick, this is usually 60 TPS                                    | Running some repeated game logic   |
| `onFrame()`      | Every render frame, only called on clients                                 | Running additional rendering logic |

#### Platform Specific Methods

Both `onInitialize()` and `onTick()` have extra lifecycle methods that only get called on either the client or the
server. These have the platform as the suffix, eg: `onInitializeServer()`. This can be useful if

:::warning Due to a limitation in TypeScript using the platform-specific lifecycle methods will **not** narrow the type
on `this.game` to `ClientGame` or `ServerGame`.

If you need this behavior you can still do it with a guard inside the non platform-specific method.

```ts
import { Behavior } from "@dreamlab/engine";

export default class MyBehavior extends Behavior {
  onInitialize(): void {
    if (this.game.isServer()) {
      // run server-only code here
      // this.game will be of type ServerGame
    }
  }
}
```

:::
