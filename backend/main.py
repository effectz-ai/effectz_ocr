# import libraries
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware

# load environment variables
load_dotenv()

import logging
import os
from pathlib import Path
import uvicorn
from fastapi import FastAPI

from app.api.get_markdown import get_markdown_router
from app.api.layout_entity_markdown import layout_entity_markdown_router

# initialize app
app = FastAPI()


# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,  
    allow_methods=["*"],  
    allow_headers=["*"],  
)
# logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger()

# temporary storage for pdfs and images
TEMP_STORAGE_DIR = os.getenv("TEMP_STORAGE_DIR", "temp_storage")

if not os.path.exists(TEMP_STORAGE_DIR):
    os.makedirs(TEMP_STORAGE_DIR)

app.include_router(get_markdown_router, prefix="/api/get_markdown")
app.include_router(layout_entity_markdown_router, prefix="/api/layout_entity_markdown")

# run app
if __name__ == "__main__":
    # set app host and app port
    app_host = os.getenv("APP_HOST", "0.0.0.0")
    app_port = int(os.getenv("APP_PORT", "5001"))

    uvicorn.run(app="main:app", host=app_host, port=app_port)
