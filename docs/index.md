---
sidebar_position: 0.1
---

# Getting Started

## What is Dreamlab?

Dreamlab is a browser-based, 2D game engine for building online games. It features:

- **Built-in Multiplayer:** Every game you create in Dreamlab is multiplayer-ready by default. No server setup or additional plug-ins
- **Collaboration:** Edit code and levels with your teammates in real-time
- **AI Tools:** Built-in AI assistant helps you write code

Dreamlab is a good fit for you if you want to:

## Quick Start Tutorial

**The easiest way to get started is to <a href="https://app.dreamlab.gg/" target="_blank">use our online editor</a>. No setup required!**

---

### Step 1: Creating Your First Project

1. Navigate to the [Create](https://app.dreamlab.gg/create/project) tab.
2. Click on the **"Create Game"** button to start a new project.
   - Select the template "Dreamlab Tutorial"
   - Enter a project name, then click **"Create Game."**

<img src="/img/tutorial/step1.png" alt="Step 1" width="600" height="600" />

---

### Step 2: Editing Your Game

After creating the project, you’ll see your project dashboard.  
Click the **"Edit Game"** button to access the editor and modify your project.

![Step 2](/img/tutorial/step2.png)

---

### Step 3: Navigating the Editor

The Dreamlab Editor consists of 5 main panels:  

On The Left:
- **Scene Graph:** Manage the entities in your game.
- **Project Panel:** View/Drag your projects behaviors and images.

On The Right:
- **Properties Panel:** Edit the selected entities transform and values.
- **Behaviors Panel:** Edit the selected entities behaviors.

On The Bottom:
- **Assistant Panel:** Chat with your ai assistant to help build your dream game.
- **Prefabs Panel:** Quickly add reusable entities to your world by dragging them.
- **Logs Panel:** View server logs from your game.

![Step 3](/img/tutorial/step3.png)

Navigate around your project with your mouse or touchpad.

- **Scroll** to zoom in or out
- **Ctrl Scroll** to pane up or down
- **Left Click** to select and entity
- **Middle Click** to pane around


---

### Step 4: Testing Your Game

Click the **Play** button at the top to test your game in real time.  
![Step 4](/img/tutorial/step4-1.png)

You can pause, resume, or exit the play session using the toolbar.
<img src="/img/tutorial/step4.png" alt="Step 4.1" width="600" height="600" />


---

### Step 5: Modifying The Level

1. Select the **Prefabs** tab from the bottom panel.
2. Drag new **Platform Prefabs** into the scene to complete the level.

![Step 5](/img/tutorial/step5.png)

3. Use the combine tool to position the entities in your scene.
- The combined tool can translate, rotate, and scale.
- The box tool can translate and scale in a different style.
<img src="/img/tutorial/step5-1.png" alt="Step 5.1" width="800" height="600" />

4. Once you position all the new entities, test your game!
<img src="/img/tutorial/step5-2.png" alt="Step 5.1" width="600" height="600" />


---

### Step 6: Changing the Player Speed

1. Select the **Player** entity in the **Scene Graph.**. It will be located in the **Prefabs** section.
2. Once selected, in the **Behaviors Panel**, edit the `speed` & `jumpForce` value under the **PlatformMovement** behavior to adjust player movement.
   *(e.g., Increase speed from 10 to 12 for faster movement.)*

![Step 6](/img/tutorial/step6.png)

---

### Step 7: Creating an Obstacle

1. In the **Prefabs** section, right-click and select **New Entity** → **Collider.**.
2. Customize the collider’s properties (e.g., change its shape, size, and color) in the **Properties Panel.**.

![Step 7](/img/tutorial/step7.png)

3. Name the Collider `Obstacle`.
4. Right click on the newly created entity and create another entity of the type: **ColoredPolygon**.
5. Try customizing your new entity.
- Select the **Obsticle Collider** and change the shape to a `circle`.
- Select the **ColoredPolygon** and change the sides and color.

![Step 7.1](/img/tutorial/step7.1.png)

---

### Step 8: Saving Your Work

Always save your project to avoid losing progress.  
Click the **Save** button at the top-right corner of the editor.

![Step 8](/img/tutorial/step8.png)

---

### Step 9: Writing Your First Script

1. In the top left, select the script editor button.

![Step 9](/img/tutorial/step9.png)

2. Right click on the `/src` folder and create a new behavior.
3. Name this behavior `obstacle-behavior.ts`

![Step 9.1](/img/tutorial/step9-1.png)

3. Our goal for this behavior is to make it teleport the player to the start of the level when they collide with it. 

So first lets listen for entity collision. 
```typescript
  onInitialize(): void {
    this.listen(this.entity, EntityCollision, (e) => {
      if (e.started) this.onCollide(e.other);
    });
  }
```

We can teleport the player to `-6, -18` which would be near the player spawnpoint or we could get the PlayerSpawnpoint position and move the player there.
```typescript
  onCollide(other: Entity) {
    if (other.name.startsWith("Player")) {
      // other.globalTransform.position = { x: -6, y: -18 };
      other.globalTransform.position = this.game.world._.PlayerSpawnpoint.transform.position;
    }
  }

```
Once you have this, the behavior should be completed! 

If you are up for a **challenge** try making the entity rotate or move in the onTick(). 
**Tip:** make sure this only runs on either the client or server!
Use the built-in AI Assistant for help writing your code.

![Step 9.2](/img/tutorial/step9-2.png)

4. Return back to the Editor to use this behavior.


---

### Step 10: Attaching a Behavior Script

1. Once returned to the editor, select the **Obstacle** entity from your **Prefabs** section.
2. Once selected, drag the created behavior script onto your prefab in the **Behavior Panel** from the **Project Panel**.

![Step 10](/img/tutorial/step10.png)

---

### Step 11: Adding Multiple Obstacles

1. Select the **Obstacle** prefab from the bottom **Prefabs Panel**.
2. Drag and position it multiple times in your scene to populate the level.
![Step 11](/img/tutorial/step11.png)


---

### Step 12: Testing!

1. Test your game again by clicking the **Play** button.
2. Check if the behaviors work as expected.
3. Make any adjustments that are needed.

![Final Step](/img/tutorial/final-step.png)

---

## Next Steps

If you finished the tutorial above, congratulations!

Now you can:

1. [Join our Discord to get help, share your games, and view things other people have created!](https://discord.gg/nwXFvtJ92g)  
   - A community member or Dreamlab developer will often respond to your questions within minutes!
2. Continue to the **"Examples"** section to learn more about Dreamlab engine features.
