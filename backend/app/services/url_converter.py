import requests
from bs4 import BeautifulSoup
import markdownify 

class URLConverter:
    def convert(self, url: str):
        if not url or not url.startswith(("http://", "https://")):
            raise ValueError("Invalid URL provided")

        try:
            response = requests.get(url.strip(), timeout=10)

            if response.status_code == 200:
                soup = BeautifulSoup(response.content, 'html.parser')              
                markdown = markdownify.markdownify(str(soup), heading_style="ATX")
                return markdown
            
            else:
                return f"Error: Received status code {response.status_code}"
            
        except requests.exceptions.RequestException as e:
            return f"Error: {e}"
 