class TenantNotFoundError(Exception):
    """
    Exception raised when a tenant is not found.
    
    Attributes:
        tenant_id -- ID of the tenant that was not found
        message -- explanation of the error
    """
    
    def __init__(self, tenant_id: str, message: str = "Tenant not found"):
        self.tenant_id = tenant_id
        self.message = f"{message}: {tenant_id}"
        super().__init__(self.message)

class CompanyNotFoundError(Exception):
    """
    Raised when no tenant secret is found for a given access ID.
    
    Attributes:
        company_id -- the provided access ID
        message -- explanation of the error
    """
    def __init__(self, company_id: str, message: str = "Company not found"):
        self.access_id = company_id
        self.message = f"{message}: {company_id}"
        super().__init__(self.message)


class InvalidHMACSignatureError(Exception):
    def __init__(self, company_id: str):
        self.message = f"Invalid HMAC signature for access ID: {company_id}"
        super().__init__(self.message)

class TokenExpiredError(Exception):
    def __init__(self, request_time: int, current_time: int):
        self.message = f"Token expired (req: {request_time}, now: {current_time})"
        super().__init__(self.message)

class DocumentNotFoundForVectorstoreError(Exception):
    """
    Raised when no documents are found in the tenant folder to build a vectorstore.

    Attributes:
        tenant_id -- the ID of the tenant
        message -- explanation of the error
    """
    def __init__(self, tenant_id: str, message: str = "No documents found to build vectorstore"):
        self.tenant_id = tenant_id
        self.message = f"{message}: {tenant_id}"
        super().__init__(self.message)

class TenantConfigNotFoundError(Exception):
    """
    Raised when the configuration file for a tenant does not exist or cannot be loaded.
    
    Attributes:
        tenant_id -- the tenant ID for which the config was not found
        message -- explanation of the error
    """
    def __init__(self, tenant_id: str, message: str = "Tenant config not found"):
        self.tenant_id = tenant_id
        self.message = f"{message} for tenant: {tenant_id}"
        super().__init__(self.message)

class TenantDocumentNotFoundError(Exception):
    """
    Raised when a document file is not found for a tenant.

    Attributes:
        document_name -- name of the document
        external_id -- tenant's external identifier
        message -- explanation of the error
    """
    def __init__(self, document_name: str, external_id: str, message: str = "Document not found"):
        self.document_name = document_name
        self.external_id = external_id
        self.message = f"{message}: '{document_name}' for tenant '{external_id}'"
        super().__init__(self.message)