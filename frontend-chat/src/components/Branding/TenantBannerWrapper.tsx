'use client'

import { useIsMobile } from '@/hooks/use-mobile'
import dynamic from 'next/dynamic'

const TenantBanner = dynamic(() => import('./TenantBrand'), { ssr: false })

export default function TenantBannerWrapper() {
    const isMobile = useIsMobile()

    if (isMobile) return null

    return <TenantBanner />
}
