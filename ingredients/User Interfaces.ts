import { Behavior, UILayer } from '@dreamlab/engine'
import { element } from '@dreamlab/ui'

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
  #ui = this.entity.cast(UILayer)
  #element!: HTMLDivElement
  score: number = 0

  setup() {
    this.defineValues(DeathScreen, 'score')
  }

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
    `

    // Create a <style> element and add the CSS to it
    const style = element('style', { textContent: css })
    this.#ui.dom.appendChild(style)

    // Create a "Respawn" button using the new `element` method
    const button = element('button', { type: 'button' }, ['Respawn'])
    button.addEventListener('click', () => this.#respawnPlayer())

    // Create the main death screen UI container
    this.#element = element(
      'div',
      {
        id: 'death-screen', // Set the ID for the main container
      },
      [
        // Add an <h1> element for the "Game Over" title
        element('h1', { className: 'example-classname' }, ['Game Over']),

        // Add a <p> element to display the player's final score
        element('p', {}, [`Final Score: ${this.score.toLocaleString()}`]),

        // Add the "Respawn" button created earlier
        button,
      ],
    )

    // Append the death screen UI container to the UI layer
    this.#ui.element.appendChild(this.#element)
  }

  #respawnPlayer() {
    spawnPlayer(this.game)

    // Destroy the current entity, removing the death screen from the UI
    this.entity.destroy()
  }
}
