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