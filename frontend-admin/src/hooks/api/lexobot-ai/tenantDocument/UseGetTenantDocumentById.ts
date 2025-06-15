import { isPresent } from "@/lib/utils";
import { ApiError } from "openapi-typescript-fetch";
import { TenantDocumentResponse } from "@/types/lexobot-ai";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { castRequestBody, UseTypedApiClientLA } from "@/hooks/UseTypedApiClientLA";

export const UseGetTenantDocumentById = (tenantId: string | undefined, tenantDocumentId: string | undefined): UseQueryResult<TenantDocumentResponse, ApiError> => {
    const path = '/api/v1/tenants/{tenant_id}/documents/{document_id}';
    const method = 'get';

    const getTenantDocument = UseTypedApiClientLA({ path, method })

    return useQuery({
        queryKey: ["GetTenantDocument", tenantId, tenantDocumentId],
        queryFn: async () => {
            const { data } = await getTenantDocument(castRequestBody({ tenant_id: Number(tenantId), document_id: Number(tenantDocumentId) }, path, method));
            return data
        },
        retry: false,
        enabled: isPresent(tenantDocumentId),
        staleTime: 0,
    })
}