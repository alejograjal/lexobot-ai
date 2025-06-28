'use client'

import { getTenantImageUrl } from '@/lib/api'
import { useSearchParams } from 'next/navigation'

export function useTenantBranding() {
    const searchParams = useSearchParams()

    const tenantId = searchParams.get('tenant_id') ?? ''
    const hasTenantImage = tenantId.trim() !== ''
    const isValidTenant = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(tenantId)
    const tenantImagePath = hasTenantImage ? getTenantImageUrl(tenantId) : null
    const companyImagePath = '/LexoBot-AI.png'

    return {
        tenantId,
        hasTenantImage,
        isValidTenant,
        tenantImagePath,
        companyImagePath,
    }
}
