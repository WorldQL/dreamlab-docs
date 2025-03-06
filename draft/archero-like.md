
## Building The Prototype
I started with the "Dreamlab Tutorial" template.
First, I prompted:
> ✍️ "make the movement top down"

Followed by
> ✍️ "make an enemy that shoots bullets at the player, remember this is singleplayer"

Then I followed the steps the editor recommended:

![image](https://github.com/user-attachments/assets/aa762248-59f2-4dcc-bf60-5c93298ac77b)

This initial implementation spawned enemies all at once, so entered another prompt:
> ✍️ "make the enemies spawn in waves of three"

Now, we need healthbars and the ability for the player to fight back! Let's prompt

> ✍️ "Add health bars for the enemies and players."

After this, I got the following. The AI automatically assumed we wanted the player to be able to shoot, so the player can shoot on click.


https://github.com/user-attachments/assets/625e76bc-c554-4aaa-8948-d9622bffd146


I noticed a bug in this video where enemies leave behind a background of their health bar when killed. I fixed it by prompting:
> ✍️ "the health bars get smaller in the middle instead of shifting"

And as you can see, the AI fixes it!

**Now, let's add "Archero" style shooting!**
> ✍️ "make it so the player automatically fires twice per second towards the nearest enemy only if they're standing still"

https://github.com/user-attachments/assets/e3368342-7a10-46fd-8830-d6fcd591dc99

This worked perfectly, and now the player shoots automatically only when standing still!

**Adding mobile controls**

Dreamlab supports npm modules, so we create a new file called `joystick.tsx` with a static class that lets us easily get the joystick data anywhere. We use https://www.npmjs.com/package/nipplejs for the joystick.

```ts
import nipplejs from "npm:nipplejs";
export class NippleMovement {
  static joystickMovement = { x: 0, y: 0 };
}

export default class UI extends UIBehavior {
  private joystick;

  onInitializeClient() {
    // need setTimeout to wait for this.uiElement to be defined.
    setTimeout(() => {
      this.joystick = nipplejs.create({
        zone: this.uiElement,
        color: "blue",
        position: { left: "50%", bottom: "25%" },
        mode: "dynamic",
        size: 150,
      });

      // Add event listeners for joystick movement
      this.joystick.on("move", (evt, data) => {
        // Normalize the vector and store it
        const force = data.force > 1 ? 1 : data.force;
        NippleMovement.joystickMovement = {
          x: Math.cos(data.angle.radian) * force,
          y: Math.sin(data.angle.radian) * force,
        };
      });

      // Reset movement when joystick is released
      this.joystick.on("end", () => {
        NippleMovement.joystickMovement = { x: 0, y: 0 };
      });
    });
  }

  render() {
    return <div style={{ width: "100%", height: "100%", position: "relative" }}></div>;
  }
}
```

Then, we simply prompt:
> ✍️ "wire up the joystick in joystick.tsx to control the player"

And now the player is controllable with the on-screen joystick!


https://github.com/user-attachments/assets/822e86f7-e6fe-48bb-be92-8bc2ad9a0fe0



