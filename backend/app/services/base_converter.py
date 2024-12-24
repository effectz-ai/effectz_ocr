class BaseConverter:

    def convert_images_to_format(self, system_prompt: str, image_path_list: list[str]):
        raise NotImplementedError("Subclasses must implement this method.")