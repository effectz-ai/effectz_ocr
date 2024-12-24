import os
import ollama

from .base_converter import BaseConverter

class OllamaConverter(BaseConverter):

    def convert_images_to_format(self, system_prompt: str, image_path_list: list[str]):
        return self.convert_images_to_format_ollama_vlm(system_prompt, image_path_list)

    def convert_images_to_format_ollama_vlm(self, system_prompt: str, image_path_list: list[str]):
        vlm_name = os.getenv("OLLAMA_VLM")

        if vlm_name is None:
            raise ValueError(
                "Please set the Ollama VLM"
            )

        response = ollama.chat(
            model=vlm_name, 
            messages=[
                {
                    'role': 'system',
                    'content': (system_prompt)
                },
                {
                    'role': 'user',
                    'images': image_path_list
                }
            ]
        )

        return response["message"]["content"]
