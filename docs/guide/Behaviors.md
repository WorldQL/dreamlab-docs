# Behaviors

Behaviors are how you implement logic into your game. A behavior is a script file written
in TypeScript that are attached to [Entities](./Entities.mdx).

## Properties

- `game`
- `entity`
- `time`
- `inputs`

## Lifecycle Hooks

- `setup()`
- `onInitialize()`
- `onPreTick()`
- `onTick()`
- `onPostTick()`
- `onFrame()`

### Platform Specific Variants
- `onTickClient()`
- `onTickServer()`
- `onInitializeClient()`
- `onInitializeServer()`

## Other Methods

- `hasAuthority()`
