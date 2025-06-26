import os
import re
import asyncio
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
        return datetime.now().isoformat()
    
async def extract_text_and_split_async(pdf_path: str, filename: str, tenant_id: str, splitter):
    text = await asyncio.to_thread(extract_text_from_pdf, pdf_path)
    chunks = splitter.split_text(text)
    date_str = extract_date_from_filename(filename, pdf_path)
    metadatas = [{"tenant_id": tenant_id, "source": filename, "date": date_str} for _ in chunks]
    return chunks, metadatas

async def load_all_pdfs_and_split_with_metadata(tenant_id: str, folder_path: str):
    texts = []
    metadatas = []
    splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=100)
    tasks = []

    for filename in os.listdir(folder_path):
        if filename.endswith(".pdf"):
            pdf_path = os.path.join(folder_path, filename)
            tasks.append(extract_text_and_split_async(pdf_path, filename, tenant_id, splitter))

    results = await asyncio.gather(*tasks)
    for chunks, metas in results:
        texts.extend(chunks)
        metadatas.extend(metas)

    return texts, metadatas