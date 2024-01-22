"use strict";(self.webpackChunkdreamlab_docs=self.webpackChunkdreamlab_docs||[]).push([[578],{9036:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>c,contentTitle:()=>o,default:()=>p,frontMatter:()=>r,metadata:()=>l,toc:()=>d});var i=t(5893),a=t(1151);const s=t.p+"assets/medias/testBall demo-d7a68ab9f13af9d66bda7dfd9ddee200.mp4",r={sidebar_position:1},o="Entities",l={id:"concepts/entities",title:"Entities",description:"In Dreamlab, entities are any object in the world. They can move, have physics and colliders, render sprites, and more.",source:"@site/docs/concepts/entities.mdx",sourceDirName:"concepts",slug:"/concepts/entities",permalink:"/concepts/entities",draft:!1,unlisted:!1,editUrl:"https://github.com/WorldQL/dreamlab-docs/tree/trunk/docs/concepts/entities.mdx",tags:[],version:"current",sidebarPosition:1,frontMatter:{sidebar_position:1},sidebar:"tutorialSidebar",previous:{title:"Concepts",permalink:"/category/concepts"},next:{title:"Animated Sprites",permalink:"/concepts/animated-sprites"}},c={},d=[{value:"Example 1 - Bouncing Ball",id:"example-1---bouncing-ball",level:2},{value:"Registering Entities",id:"registering-entities",level:3},{value:"Spawning Entities",id:"spawning-entities",level:3},{value:"Example 2 - Mob with Health Bar",id:"example-2---mob-with-health-bar",level:2}];function h(e){const n={code:"code",h1:"h1",h2:"h2",h3:"h3",p:"p",pre:"pre",...(0,a.a)(),...e.components};return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)(n.h1,{id:"entities",children:"Entities"}),"\n",(0,i.jsx)(n.p,{children:"In Dreamlab, entities are any object in the world. They can move, have physics and colliders, render sprites, and more."}),"\n",(0,i.jsx)(n.p,{children:"The best way to learn the anatomy of an entity is an example. Below are some sample entities of varying complexity."}),"\n",(0,i.jsx)(n.h2,{id:"example-1---bouncing-ball",children:"Example 1 - Bouncing Ball"}),"\n",(0,i.jsx)(n.p,{children:"This is a simple 2D bouncing ball."}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-js",children:"import { createSpawnableEntity } from '@dreamlab.gg/core'\nimport { Vec, toDegrees, toRadians } from '@dreamlab.gg/core/math'\nimport { drawCircle } from '@dreamlab.gg/core/utils'\nimport Matter from 'matter-js'\nimport { Graphics } from 'pixi.js'\n\nexport const createTestBall = createSpawnableEntity(\n  ({ transform, zIndex, tags, preview }, radius) => {\n    // Every object gets a transform automatically, this hold position and rotation information.\n    const { position, rotation } = transform\n\n    const mass = 20\n\n    // Create our bouncy ball's physics body.\n    const body = Matter.Bodies.circle(position.x, position.y, radius, {\n      label: 'testBall',\n      render: { visible: false },\n      angle: toRadians(rotation),\n      // the \"preview\" variable is true if the object isn't placed in the world yet but is a floating preview.\n      // This is used to make your object compatible with the in-game level editor, so it doesn't collide while a preview.\n      isStatic: preview,\n      isSensor: preview,\n\n      mass,\n      inverseMass: 1 / mass,\n      // The bounciness of the ball.\n      restitution: 0.95,\n\n      // You can also set initial inertia but we don't for this example.\n      // inertia: Number.POSITIVE_INFINITY,\n      // inverseInertia: 0,\n    })\n\n    return {\n      get transform() {\n        return {\n          position: Vec.clone(body.position),\n          rotation: toDegrees(body.angle),\n        }\n      },\n\n      // Tags are used to identify certain entity types. For example, \"enemy\", \"hpPowerUp\", etc.\n      // these are similar to Tags in Unity\n      get tags() {\n        return tags\n      },\n\n      // Determine whether the camera should render this entity.\n      isInBounds(position) {\n        return Matter.Query.point([body], position).length > 0\n      },\n\n      // Run when the entity is first initialized on the client or the server.\n      init({ game, physics }) {\n        const debug = game.debug\n        physics.register(this, body)\n\n        return { debug, physics, body }\n      },\n\n      // Run when the entity is initialized ONLY on the client.\n      initRenderContext(_, { stage, camera }) {\n        const gfx = new Graphics()\n        gfx.zIndex = zIndex + 1\n        drawCircle(gfx, { radius })\n\n        stage.addChild(gfx)\n\n        return { camera, gfx }\n      },\n\n      // Run when entity is destroyed.\n      teardown({ physics, body }) {\n        physics.unregister(this, body)\n      },\n      // Run when entity is destroyed, only run on client.\n      teardownRenderContext({ gfx }) {\n        gfx.destroy()\n      },\n\n      onRenderFrame(_, { body }, { camera, gfx }) {\n        // Get the position of the entity relative to the camera.\n        const pos = Vec.add(body.position, camera.offset)\n        // update the position and rotation in screen space terms.\n        gfx.position = pos\n        gfx.rotation = body.angle\n        gfx.alpha = 1\n      },\n    }\n  },\n)\n"})}),"\n",(0,i.jsx)(n.h3,{id:"registering-entities",children:"Registering Entities"}),"\n",(0,i.jsxs)(n.p,{children:["All entities need to be registered with the Dreamlab engine before they can be used. This is done in the ",(0,i.jsx)(n.code,{children:"sharedInit"})," function that runs on both the client and the server."]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-js",children:"export const sharedInit = async game => {\n  // register testBall\n  game.register('testBall', createTestBall)\n  // spawn the rest of our predefined level\n  await game.spawnMany(...level)\n}\n"})}),"\n",(0,i.jsx)(n.h3,{id:"spawning-entities",children:"Spawning Entities"}),"\n",(0,i.jsx)(n.p,{children:"For this example, we want our bouncy ball to be synced between the client and server and also spawn over time."}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-js",children:"import { sharedInit } from './shared.js'\n\nfunction randInt(min, max) {\n  return Math.floor(Math.random() * (max - min)) + min;\n}\n\n/** @type {import('@dreamlab.gg/core/sdk').InitServer} */\nexport const init = async game => {\n  await sharedInit(game)\n\n  // Spawn 50 balls, one per second.\n  for (let i = 0; i < 50; i++) {\n    setTimeout(() => {\n      game.spawn({\n        entity: 'testBall',\n        // Give the ball a random radius between 20 and 150.\n        // This is the \"radius\" positional argument on createTestBall\n        args: [randInt(20, 150)],\n        // Spawn the ball at a random x coordinate between -600 and 600\n        transform: { position: [randInt(-600, 600), -700] },\n        // Give the ball a \"net/replicated\" tag to automatically sync it between clients \n        tags: ['net/replicated'],\n      })\n    }, i * 1000);\n  }\n}\n"})}),"\n",(0,i.jsx)(n.p,{children:"These are the results when connecting on two clients. Notice the physics simulation is seamlessly synced:"}),"\n","\n","\n",(0,i.jsx)("video",{style:{width:"100%"},controls:!0,src:s}),"\n",(0,i.jsx)(n.h2,{id:"example-2---mob-with-health-bar",children:"Example 2 - Mob with Health Bar"}),"\n",(0,i.jsx)(n.p,{children:"Suppose we want to create a mob which players using the default character controller can attack.\nTODO: Finish"})]})}function p(e={}){const{wrapper:n}={...(0,a.a)(),...e.components};return n?(0,i.jsx)(n,{...e,children:(0,i.jsx)(h,{...e})}):h(e)}},1151:(e,n,t)=>{t.d(n,{Z:()=>o,a:()=>r});var i=t(7294);const a={},s=i.createContext(a);function r(e){const n=i.useContext(s);return i.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function o(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(a):e.components||a:r(e.components),i.createElement(s.Provider,{value:n},e.children)}}}]);