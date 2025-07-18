'use client'

import Image from 'next/image'
import { useTenantBranding } from '@/hooks/useTenantBranding'

export default function TenantBanner() {
    const { hasTenantImage, tenantImagePath, companyImagePath } = useTenantBranding()

    return (
        <div className="relative flex flex-row items-center justify-center w-full max-w-[36rem] h-36 sm:h-48 md:h-[10rem] mt-4 md:mt-0 gap-2">
            {hasTenantImage && tenantImagePath ? (
                <>
                    <div className="relative flex-1 h-full">
                        <Image src={companyImagePath} alt="Company Logo" fill style={{ objectFit: 'cover' }} priority />
                    </div>
                    <div className="w-px h-full bg-zinc-300 dark:bg-zinc-700" />
                    <div className="relative flex-1 h-full">
                        <Image src={tenantImagePath} alt="Imagen del condominio" fill style={{ objectFit: 'cover' }} priority unoptimized />
                    </div>
                </>
            ) : (
                <div className="relative w-[22rem] h-full">
                    <Image src="/LexoBot-AI.png" alt="LexoBot-AI Logo" fill style={{ objectFit: 'cover' }} priority />
                </div>
            )}
        </div>
    )
}
