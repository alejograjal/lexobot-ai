'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const { isAuthenticated, authLoaded } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (authLoaded && !isAuthenticated) {
            router.replace('/login')
        }
    }, [authLoaded, isAuthenticated, router])

    if (!authLoaded) return null

    return <>{children}</>
}