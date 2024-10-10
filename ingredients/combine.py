import os
import json


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
    js_output = f"export const fileContents = {js_dict};"

    with open("file_contents.js", "w", encoding="utf-8") as js_file:
        js_file.write(js_output)

    print("JavaScript dictionary has been created in 'file_contents.js'")


def create_mdx_files(file_dict):
    mdx_dir = os.path.abspath(os.path.join(os.getcwd(), "../pages/ingredients"))
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
            mdx_filename = file_name.replace(" ", "-").replace("_", "-").lower() + ".mdx"
            # Keep the title as the original filename with spaces instead of underscores
            title = file_name.replace("_", " ")

        mdx_filepath = os.path.join(mdx_dir, mdx_filename)
        mdx_content = "import { AIDocs } from '~/components/under-construction'\n\n"
        mdx_content += f"# {title}\n\n<AIDocs/>\n```typescript\n{file_contents}\n```"

        try:
            with open(mdx_filepath, "w", encoding="utf-8") as mdx_file:
                mdx_file.write(mdx_content)
            print(f"Created MDX file: {mdx_filepath}")
        except Exception as e:
            print(f"Error writing MDX file {mdx_filename}: {str(e)}")


if __name__ == "__main__":
    file_dict = collect_files()
    create_js_dictionary(file_dict)
    create_mdx_files(file_dict)
