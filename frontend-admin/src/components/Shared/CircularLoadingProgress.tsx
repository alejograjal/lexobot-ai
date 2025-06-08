'use client'

import { Loader2 } from "lucide-react"

export const CircularLoadingProgress = () => {
    return (
        <div className="flex justify-center items-center">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
    )
}
