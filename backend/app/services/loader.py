import os
from app.utils.file import extract_text_from_pdf
from langchain.text_splitter import RecursiveCharacterTextSplitter
from app.core.config import settings

def load_all_pdfs_and_split(folder_path: str):
    all_text = ""
    for filename in os.listdir(folder_path):
        if filename.endswith(".pdf"):
            pdf_path = os.path.join(folder_path, filename)
            all_text += extract_text_from_pdf(pdf_path) + "\n"

    splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=100)
    return splitter.split_text(all_text)