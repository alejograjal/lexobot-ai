from app.utils import get_tenant_secret
from app.scripts import build_vectorstore_for_tenant
from app.services.tenant.tenant_file_service import TenantFileService
from app.services.auth.hmac_validator_service import HMACValidatorService
from fastapi import APIRouter, UploadFile, File, Form, Header, status, Depends, Path, Query

router = APIRouter(prefix="/api", tags=["Tenant Upload"])

hmac_validator = HMACValidatorService(secret_provider=get_tenant_secret)
file_service = TenantFileService()

def validate_signature(
    company_access_id: str = Header(..., alias="X-Company-Access-Id"),
    timestamp: str = Header(..., alias="X-Timestamp"),
    signature: str = Header(..., alias="X-Signature")
) -> None:
    hmac_validator.validate(company_access_id, timestamp, signature)

@router.post("/upload-document", status_code=status.HTTP_201_CREATED)
async def upload_document(
    file: UploadFile = File(...),
    document_name: str = Form(...),
    external_id: str = Form(...),
    _ = Depends(validate_signature)
):
    saved_path = await file_service.save_document(file, document_name, external_id)
    return {
        "status": "uploaded",
        "file_path": saved_path,
        "document_name": document_name,
        "external_id": external_id
    }

@router.delete("/remove-document/{document_name}", status_code=status.HTTP_200_OK)
async def remove_document(
    document_name: str = Path(..., description="The name of the document to remove"),
    external_id: str = Query(..., description="External tenant identifier"),
    _ = Depends(validate_signature)
):
    file_service.remove_document(document_name=document_name, external_id=external_id)
    return {
        "status": "deleted",
        "document_name": document_name,
        "external_id": external_id
    }


@router.post("/build-vectorstore/{external_id}", status_code=status.HTTP_200_OK)
async def build_vectorstore(
    external_id: str,
    _ = Depends(validate_signature)
):
    await build_vectorstore_for_tenant(external_id)
    return {
        "status": "vectorstore_built",
        "external_id": external_id
    }