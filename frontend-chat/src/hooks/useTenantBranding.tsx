'use client'

import { getTenantImageUrl } from '@/lib/api'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

export function useTenantBranding() {
    const searchParams = useSearchParams()
    const tenantId = searchParams.get('tenant_id') ?? ''
    const [imageExists, setImageExists] = useState(false)

    const isValidTenant = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(tenantId)
    const tenantImagePath = tenantId.trim() !== '' ? getTenantImageUrl(tenantId) : null
    const companyImagePath = '/LexoBot-AI.png'

    useEffect(() => {
        if (!tenantImagePath) {
            setImageExists(false)
            return
        }

        const img = new Image()
        img.src = tenantImagePath
        img.onload = () => setImageExists(true)
        img.onerror = () => setImageExists(false)
    }, [tenantImagePath])


    return {
        tenantId,
        hasTenantImage: imageExists,
        isValidTenant,
        tenantImagePath,
        companyImagePath,
    }
}
