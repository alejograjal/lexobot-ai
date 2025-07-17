'use client'

import { useState } from 'react'
import { TooltipProvider } from '@/components/ui/tooltip'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

export function Providers({ children }: { children: React.ReactNode }) {
    const [queryClient] = useState(() => new QueryClient())

    return (
        <QueryClientProvider client={queryClient}>
            <TooltipProvider>
                <Sonner position="bottom-center" richColors closeButton />
                {children}
            </TooltipProvider>
        </QueryClientProvider>
    )
}