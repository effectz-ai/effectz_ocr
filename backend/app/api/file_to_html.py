import os
import logging
from fastapi import APIRouter, HTTPException, Form, UploadFile, File
from pathlib import Path

from app.api.api_utils import process_file

file_to_html_router = app = APIRouter()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger()

system_prompt = os.getenv("FILE_TO_HTML_SYSTEM_PROMPT")

# POST - /api/file_to_html
@app.post("")
async def file_to_html(file: UploadFile = File(...), conversion_model_type: str | None = Form(None)):
    try:
        if file.filename == "":
            logger.warning(f"No file uploaded")
            raise HTTPException(status_code=400, detail="No file uploaded")
         
        file_extension = Path(file.filename).suffix.lower()
        logger.info(f"Uploaded file extension: {file_extension}")

        if file_extension not in [".pdf", ".docx", ".jpg", ".jpeg", ".png"]:
            logger.warning(f"Invalid file type: {file_extension}")
            raise HTTPException(status_code=400, detail=f"Unsupported file type: {file_extension}")
        
        response = await process_file(file, file_extension, system_prompt, conversion_model_type)

        logger.info("Document converted successfully")
        return {'html': response}

    except Exception as e:
        logger.error(f"An error occurred during conversion: {str(e)}")
        raise HTTPException(status_code=500, detail=f"An error occurred during conversion: {str(e)}")