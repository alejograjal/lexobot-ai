'use client'

import { Suspense } from 'react'
import TenantBanner from './TenantBrand'

export default function TenantBannerWrapper() {
    return (
        <Suspense fallback={null}>
            <TenantBanner />
        </Suspense>
    )
}