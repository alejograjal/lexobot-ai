import { isPresent } from "@/lib/utils";
import { ApiError } from "openapi-typescript-fetch";
import { TenantDocumentResponse } from "@/types/lexobot-ai";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { castRequestBody, UseTypedApiClientLA } from "@/hooks/UseTypedApiClientLA";

export const UseGetTenantDocuments = (tenantId: string | undefined): UseQueryResult<TenantDocumentResponse[], ApiError> => {
    const path = '/api/v1/tenants/{tenant_id}/documents';
    const method = 'get';

    const getTenantDocuments = UseTypedApiClientLA({ path, method })

    return useQuery({
        queryKey: ["GetTenantDocuments", tenantId],
        queryFn: async () => {
            const { data } = await getTenantDocuments(castRequestBody({ tenant_id: Number(tenantId) }, path, method));
            return data
        },
        retry: false,
        enabled: isPresent(tenantId),
        staleTime: 0,
    })
}