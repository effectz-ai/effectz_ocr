class BaseMarkdownConverter:

    def convert_to_markdown(self, system_prompt: str, image_path_list: list[str]):
        raise NotImplementedError("Subclasses must implement this method.")
