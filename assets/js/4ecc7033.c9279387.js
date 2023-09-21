"use strict";(self.webpackChunkdreamlab_docs=self.webpackChunkdreamlab_docs||[]).push([[354],{3905:(e,t,n)=>{n.d(t,{Zo:()=>p,kt:()=>h});var i=n(7294);function r(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function a(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);t&&(i=i.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,i)}return n}function o(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?a(Object(n),!0).forEach((function(t){r(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):a(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function s(e,t){if(null==e)return{};var n,i,r=function(e,t){if(null==e)return{};var n,i,r={},a=Object.keys(e);for(i=0;i<a.length;i++)n=a[i],t.indexOf(n)>=0||(r[n]=e[n]);return r}(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(i=0;i<a.length;i++)n=a[i],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(r[n]=e[n])}return r}var l=i.createContext({}),c=function(e){var t=i.useContext(l),n=t;return e&&(n="function"==typeof e?e(t):o(o({},t),e)),n},p=function(e){var t=c(e.components);return i.createElement(l.Provider,{value:t},e.children)},d="mdxType",m={inlineCode:"code",wrapper:function(e){var t=e.children;return i.createElement(i.Fragment,{},t)}},u=i.forwardRef((function(e,t){var n=e.components,r=e.mdxType,a=e.originalType,l=e.parentName,p=s(e,["components","mdxType","originalType","parentName"]),d=c(n),u=r,h=d["".concat(l,".").concat(u)]||d[u]||m[u]||a;return n?i.createElement(h,o(o({ref:t},p),{},{components:n})):i.createElement(h,o({ref:t},p))}));function h(e,t){var n=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var a=n.length,o=new Array(a);o[0]=u;var s={};for(var l in t)hasOwnProperty.call(t,l)&&(s[l]=t[l]);s.originalType=e,s[d]="string"==typeof e?e:r,o[1]=s;for(var c=2;c<a;c++)o[c]=n[c];return i.createElement.apply(null,o)}return i.createElement.apply(null,n)}u.displayName="MDXCreateElement"},6897:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>c,contentTitle:()=>s,default:()=>u,frontMatter:()=>o,metadata:()=>l,toc:()=>p});var i=n(7462),r=(n(7294),n(3905));const a=n.p+"assets/medias/testBall demo-d7a68ab9f13af9d66bda7dfd9ddee200.mp4",o={sidebar_position:1},s="Entities",l={unversionedId:"concepts/entities",id:"concepts/entities",title:"Entities",description:"In Dreamlab, Entities are simply any object in the world. They can move, have physics, render sprites, and more.",source:"@site/docs/concepts/entities.md",sourceDirName:"concepts",slug:"/concepts/entities",permalink:"/dreamlab-docs/concepts/entities",draft:!1,editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/concepts/entities.md",tags:[],version:"current",sidebarPosition:1,frontMatter:{sidebar_position:1},sidebar:"tutorialSidebar",previous:{title:"Concepts",permalink:"/dreamlab-docs/category/concepts"},next:{title:"Animated Sprites",permalink:"/dreamlab-docs/concepts/animated-sprites"}},c={},p=[{value:"Examples",id:"examples",level:2},{value:"Bouncing Ball",id:"bouncing-ball",level:2},{value:"Registering Entities",id:"registering-entities",level:3},{value:"Spawning Entities",id:"spawning-entities",level:3},{value:"Complex Example - Hostile Mob with Health Bar",id:"complex-example---hostile-mob-with-health-bar",level:2}],d={toc:p},m="wrapper";function u(e){let{components:t,...n}=e;return(0,r.kt)(m,(0,i.Z)({},d,n,{components:t,mdxType:"MDXLayout"}),(0,r.kt)("h1",{id:"entities"},"Entities"),(0,r.kt)("p",null,"In Dreamlab, Entities are simply any object in the world. They can move, have physics, render sprites, and more."),(0,r.kt)("h2",{id:"examples"},"Examples"),(0,r.kt)("p",null,"The best way to learn the anatomy of an entity is an example. Below are some sample entities of varying complexity."),(0,r.kt)("h2",{id:"bouncing-ball"},"Bouncing Ball"),(0,r.kt)("p",null,"This is a simple 2D bouncing ball."),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-js"},"import { createSpawnableEntity } from '@dreamlab.gg/core'\nimport { Vec, toDegrees, toRadians } from '@dreamlab.gg/core/math'\nimport { drawCircle } from '@dreamlab.gg/core/utils'\nimport Matter from 'matter-js'\nimport { Graphics } from 'pixi.js'\n\nexport const createTestBall = createSpawnableEntity(\n  ({ transform, zIndex, tags, preview }, radius) => {\n    // Every object gets a transform automatically, this hold position and rotation information.\n    const { position, rotation } = transform\n\n    const mass = 20\n\n    // Create our bouncy ball's physics body.\n    const body = Matter.Bodies.circle(position.x, position.y, radius, {\n      label: 'testBall',\n      render: { visible: false },\n      angle: toRadians(rotation),\n      // the \"preview\" variable is true if the object isn't placed in the world yet but is a floating preview.\n      // This is used to make your object compatible with the in-game level editor, so it doesn't collide while a preview.\n      isStatic: preview,\n      isSensor: preview,\n\n      mass,\n      inverseMass: 1 / mass,\n      // The bounciness of the ball.\n      restitution: 0.95,\n\n      // You can also set initial inertia but we don't for this example.\n      // inertia: Number.POSITIVE_INFINITY,\n      // inverseInertia: 0,\n    })\n\n    return {\n      get transform() {\n        return {\n          position: Vec.clone(body.position),\n          rotation: toDegrees(body.angle),\n        }\n      },\n\n      // Tags are used to identify certain entity types. For example, \"enemy\", \"hpPowerUp\", etc.\n      // these are similar to Tags in Unity\n      get tags() {\n        return tags\n      },\n\n      // Determine whether the camera should render this entity.\n      isInBounds(position) {\n        return Matter.Query.point([body], position).length > 0\n      },\n\n      // Run when the entity is first initialized on the client or the server.\n      init({ game, physics }) {\n        const debug = game.debug\n        physics.register(this, body)\n\n        return { debug, physics, body }\n      },\n\n      // Run when the entity is initialized ONLY on the client.\n      initRenderContext(_, { stage, camera }) {\n        const gfx = new Graphics()\n        gfx.zIndex = zIndex + 1\n        drawCircle(gfx, { radius })\n\n        stage.addChild(gfx)\n\n        return { camera, gfx }\n      },\n\n      // Run when entity is destroyed.\n      teardown({ physics, body }) {\n        physics.unregister(this, body)\n      },\n      // Run when entity is destroyed, only run on client.\n      teardownRenderContext({ gfx }) {\n        gfx.destroy()\n      },\n\n      onRenderFrame(_, { body }, { camera, gfx }) {\n        // Get the position of the entity relative to the camera.\n        const pos = Vec.add(body.position, camera.offset)\n        // update the position and rotation in screen space terms.\n        gfx.position = pos\n        gfx.rotation = body.angle\n        gfx.alpha = 1\n      },\n    }\n  },\n)\n")),(0,r.kt)("h3",{id:"registering-entities"},"Registering Entities"),(0,r.kt)("p",null,"All entities need to be registered with the Dreamlab engine before they can be used. This is done in the ",(0,r.kt)("inlineCode",{parentName:"p"},"sharedInit")," function that runs on both the client and the server."),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-js"},"export const sharedInit = async game => {\n  // register testBall\n  game.register('testBall', createTestBall)\n  // spawn the rest of our predefined level\n  await game.spawnMany(...level)\n}\n")),(0,r.kt)("h3",{id:"spawning-entities"},"Spawning Entities"),(0,r.kt)("p",null,"For this example, we want our bouncy ball to be synced between the client and server and also spawn over time."),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-js"},"import { sharedInit } from './shared.js'\n\nfunction randInt(min, max) {\n  return Math.floor(Math.random() * (max - min)) + min;\n}\n\n/** @type {import('@dreamlab.gg/core/sdk').InitServer} */\nexport const init = async game => {\n  await sharedInit(game)\n\n  // Spawn 50 balls, one per second.\n  for (let i = 0; i < 50; i++) {\n    setTimeout(() => {\n      game.spawn({\n        entity: 'testBall',\n        // Give the ball a random radius between 20 and 150.\n        // This is the \"radius\" positional argument on createTestBall\n        args: [randInt(20, 150)],\n        // Spawn the ball at a random x coordinate between -600 and 600\n        transform: { position: [randInt(-600, 600), -700] },\n        // Give the ball a \"net/replicated\" tag to automatically sync it between clients \n        tags: ['net/replicated'],\n      })\n    }, i * 1000);\n  }\n}\n")),(0,r.kt)("p",null,"These are the results when connecting on two clients. Notice the physics simulation is seamlessly synced:"),(0,r.kt)("video",{style:{width:"100%"},controls:!0,src:a}),(0,r.kt)("h2",{id:"complex-example---hostile-mob-with-health-bar"},"Complex Example - Hostile Mob with Health Bar"))}u.isMDXComponent=!0}}]);