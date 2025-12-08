import os
import json

available_topics = {
    "Detecting Collisions": "Running code when one entity collides with another",
    "Handling Input": "Handling user input, keypresses and mouse input",
    "Handling Transforms": "Moving, scaling, and rotating objects",
    "Handling Values": "Updating the public variables associated with behaviors. These should be used to store state that can be inspected in the editor.",
    "Interacting with Behaviors": "Fetching other behaviors attached to an entity.",
    "Looking Up and Referencing Entities": "Getting entities by ID or keeping track of entities associated with a behavior.",
    "Vector2 API": "Essential vector operations like addition, subtraction, and normalization using Vector2.",
    "User Interfaces": "Creating GUIs (HUDs, health bars, etc)",
    "Spawning Entities": "Spawning new entities into the world and attaching behaviors.",
    "Character Controller": "Using the built-in character controller which handles collision detection. Great for any movement style.",
    "Basic Structure": "Behavior classes are used to implement all game functionality.",
    "Message Channels and Key Value Database": "Facilitating communication between behaviors using custom messages and synced values to synchronize state or trigger actions.",
    "Drawing with Pixi": "Rendering shapes to the screen using pixi.js",
    "Ray Casting": "Casting rays to determine object presence in the world",
}


def collect_files():
    current_dir = os.getcwd()
    file_dict = {}

    for filename in os.listdir(current_dir):
        if os.path.isfile(filename):
            file_path = os.path.join(current_dir, filename)
            file_name_without_ext, file_ext = os.path.splitext(filename)

            # Ignore specific files and only process .ts files
            if file_name_without_ext in ["combine", "file_contents", "deno"]:
                continue
            if file_ext != ".ts":
                continue

            print(f"Processing file: {file_name_without_ext}{file_ext}")

            try:
                with open(file_path, "r", encoding="utf-8") as file:
                    file_contents = file.read()
                    file_dict[file_name_without_ext] = file_contents
            except Exception as e:
                print(f"Error reading file {filename}: {str(e)}")

    return file_dict


def create_js_dictionary(file_dict):
    js_dict = json.dumps(file_dict, indent=2)
    js_output = f"export const fileContents: Record<string, string> = {js_dict};\n"
    js_output += (
        "export const available_topics = `"
        + "\n".join([f"{key} - {value}" for key, value in available_topics.items()])
        + "`"
    )

    with open("file_contents.ts", "w", encoding="utf-8") as js_file:
        js_file.write(js_output)

    print("JavaScript dictionary has been created in 'file_contents.js'")


def create_mdx_files(file_dict):
    mdx_dir = os.path.abspath(os.path.join(os.getcwd(), "../../docs/ingredients"))
    if not os.path.exists(mdx_dir):
        os.makedirs(mdx_dir)
        print(f"Created directory: {mdx_dir}")

    for file_name, file_contents in file_dict.items():
        # Handle special case for '_basic_structure'
        if file_name == "_basic-structure":
            mdx_filename = "behavior-structure.mdx"
            title = "Behavior Structure"
        else:
            # Generate mdx filename: convert to lowercase and replace underscores with hyphens
            mdx_filename = (
                file_name.replace(" ", "-").replace("_", "-").lower() + ".mdx"
            )
            # Keep the title as the original filename with spaces instead of underscores
            title = file_name.replace("_", " ")

        mdx_filepath = os.path.join(mdx_dir, mdx_filename)
        mdx_content = ""
        mdx_content += f"# {title}\n"
        mdx_content += available_topics[title] + "\n"
        mdx_content += """"""
        mdx_content += f"```typescript\n{file_contents}\n```"

        try:
            with open(mdx_filepath, "w", encoding="utf-8") as mdx_file:
                mdx_file.write(mdx_content)
            print(f"Created MDX file: {mdx_filepath}")
        except Exception as e:
            print(f"Error writing MDX file {mdx_filename}: {str(e)}")


def create_combined_doc(file_dict):
    """
    Creates one combined MDX file that concatenates the content from each ingredient.
    Each section will include a header, a description (from available_topics), and
    a typescript code block containing the file's contents.
    """
    # Use the same directory as in create_mdx_files
    mdx_dir = os.path.abspath(os.path.join(os.getcwd(), "../../docs/ingredients"))
    if not os.path.exists(mdx_dir):
        os.makedirs(mdx_dir)
        print(f"Created directory: {mdx_dir}")

    combined_content = "# Dreamlab API Reference\n\n"

    # Loop through each file's data in the dictionary.
    for file_name, file_contents in file_dict.items():
        # Handle the special case for '_basic-structure'
        if file_name == "_basic-structure":
            title = "Behavior Structure"
        else:
            # Replace underscores with spaces to form the title
            title = file_name.replace("_", " ")

        # Build the section content following the same structure as create_mdx_files
        combined_content += f"# {title}\n"
        try:
            combined_content += available_topics[title] + "\n"
        except KeyError:
            # If the title is not in available_topics, warn and continue.
            combined_content += "_No available topic description found._\n"
        combined_content += f"```typescript\n{file_contents}\n```\n\n"
        # Add a horizontal rule as a separator between ingredients
        combined_content += "---\n\n"

    # Append the prompt-ending.md file after all ingredients
    prompt_ending_path = os.path.join(os.getcwd(), "../prompt-ending.md")
    if os.path.exists(prompt_ending_path):
        try:
            with open(prompt_ending_path, "r", encoding="utf-8") as prompt_file:
                prompt_ending_content = prompt_file.read()
                combined_content += prompt_ending_content
            print(f"Appended content from: {prompt_ending_path}")
        except Exception as e:
            print(f"Error reading prompt-ending.md: {str(e)}")
    else:
        print(f"Warning: {prompt_ending_path} not found, skipping.")

    # Define the path for the combined document
    combined_filepath = "./combined_ingredients.md"
    try:
        with open(combined_filepath, "w", encoding="utf-8") as combined_file:
            combined_file.write(combined_content)
        print(f"Created combined document: {combined_filepath}")
    except Exception as e:
        print(f"Error writing combined document: {str(e)}")


if __name__ == "__main__":
    file_dict = collect_files()
    create_js_dictionary(file_dict)
    create_mdx_files(file_dict)
    create_combined_doc(file_dict)
