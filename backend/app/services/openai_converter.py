import os
from openai import OpenAI
import base64

from .base_converter import BaseConverter

class OpenAIConverter(BaseConverter):

    def convert_images_to_format(self, system_prompt: str, image_path_list: list[str]):
        return self.convert_images_to_format_openai(system_prompt, image_path_list)
    
    def convert_images_to_format_openai(self, system_prompt: str, image_path_list: list[str]):
        openai_key = os.getenv("OPENAI_KEY")
        mllm_name = os.getenv("OPENAI_MLLM")

        if openai_key is None:
            raise ValueError(
                "Please set the OpenAI key"
            )

        if mllm_name is None:
            raise ValueError(
                "Please set the OpenAI MLLM"
            )
        
        client = OpenAI(api_key=openai_key)

        base64_image = []
        for image_path in image_path_list:
            with open(image_path, "rb") as image_file:
                base64_image.append(
                    {
                        "type": "image_url",
                        "image_url": {
                            "url":  f"data:image/jpeg;base64,{base64.b64encode(image_file.read()).decode('utf-8')}"
                        },
                    }
                )

        content = [
            {
                "type": "text",
                "text": system_prompt,
            },
        ]

        content.extend(base64_image)

        response = client.chat.completions.create(
            model=mllm_name,
            messages=[
                {
                    "role": "user",
                    "content": content
                }
            ],
        )

        return response.choices[0].message.content