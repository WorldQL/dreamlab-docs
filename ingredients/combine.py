import os
import json

def collect_files():
    current_dir = os.getcwd()
    file_dict = {}

    for filename in os.listdir(current_dir):
        if os.path.isfile(filename):
            file_path = os.path.join(current_dir, filename)
            file_name_without_ext = os.path.splitext(filename)[0]
            print(file_name_without_ext)

            if (file_name_without_ext == 'combine' or file_name_without_ext == 'file_contents'):
                continue

            try:
                with open(file_path, 'r', encoding='utf-8') as file:
                    file_contents = file.read()
                    file_dict[file_name_without_ext] = file_contents
            except Exception as e:
                print(f"Error reading file {filename}: {str(e)}")

    return file_dict

def create_js_dictionary(file_dict):
    js_dict = json.dumps(file_dict, indent=2)
    js_output = f"export const fileContents = {js_dict};"

    with open('file_contents.js', 'w', encoding='utf-8') as js_file:
        js_file.write(js_output)

    print("JavaScript dictionary has been created in 'file_contents.js'")

if __name__ == "__main__":
    file_dict = collect_files()
    create_js_dictionary(file_dict)
