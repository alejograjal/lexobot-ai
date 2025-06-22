import os
import re
from datetime import datetime
from app.utils import extract_text_from_pdf
from langchain.text_splitter import RecursiveCharacterTextSplitter

def extract_date_from_filename(filename: str, full_path: str) -> str:
    match = re.search(r"(\d{4})[-_]?(\d{2})[-_]?(\d{2})", filename)
    if match:
        y, m, d = match.groups()
        try:
            return datetime(int(y), int(m), int(d)).isoformat()
        except ValueError:
            pass

    try:
        mod_timestamp = os.path.getmtime(full_path)
        mod_datetime = datetime.fromtimestamp(mod_timestamp)
        return mod_datetime.isoformat()
    except Exception as e:
        return datetime.now().isoformat()  # Último recurso

def load_all_pdfs_and_split_with_metadata(tenant_id: str, folder_path: str):
    texts = []
    metadatas = []
    splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=100)

    for filename in os.listdir(folder_path):
        if filename.endswith(".pdf"):
            pdf_path = os.path.join(folder_path, filename)
            text = extract_text_from_pdf(pdf_path)
            chunks = splitter.split_text(text)
            date_str = extract_date_from_filename(filename, pdf_path)

            for chunk in chunks:
                texts.append(chunk)
                metadatas.append({
                    "tenant_id": tenant_id,
                    "source": filename,
                    "date": date_str,
                })

    return texts, metadatas