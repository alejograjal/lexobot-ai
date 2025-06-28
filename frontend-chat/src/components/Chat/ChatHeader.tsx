"use client"

import Image from 'next/image'
import { useState } from 'react'
import { useIsMobile } from '@/hooks/use-mobile'
import { BrushCleaning, Info } from 'lucide-react'
import { ChatDialogInformation } from './ChatDialogInformation'

interface CharHeaderProps {
    handleClearChat: () => void
}

export default function CharHeader({ handleClearChat }: CharHeaderProps) {
    const isMobile = useIsMobile()
    const [isOpen, setIsOpen] = useState(false)

    const closeInformation = () => {
        setIsOpen(false)
    }

    return (
        <div className="sticky top-0 z-10 flex items-center justify-between p-2 bg-white dark:bg-zinc-800 border-b dark:border-zinc-700 shadow-sm">
            <ChatDialogInformation isOpen={isOpen} setIsOpen={closeInformation} />

            <div className="flex items-center gap-1">
                {isMobile && (
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gray-200 dark:bg-zinc-300 rounded border dark:border-zinc-600 relative overflow-hidden">
                            <Image src='/LexoBot-AI-Logo.png' alt="LexoBot-AI Logo" fill style={{ objectFit: 'contain' }} priority />
                        </div>
                    </div>
                )}
                <h1 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-gray-100">Conversa con LexoBot</h1>
            </div>
            <div className="flex items-center gap-2">
                <Info size={20} className="text-gray-500 dark:text-gray-300" onClick={() => setIsOpen(true)} />
                <button
                    onClick={handleClearChat}
                    className="px-2 py-1 md:px-3 md:py-2 text-sm font-medium border border-gray-300 dark:border-zinc-600 rounded-md bg-white dark:bg-zinc-700 hover:bg-red-50 dark:hover:bg-red-600/20 hover:text-red-600 dark:hover:text-red-400 hover:border-red-200 dark:hover:border-red-400 transition-colors flex items-center gap-1 text-gray-900 dark:text-gray-100"
                >
                    <BrushCleaning className="w-5 h-5" />
                    <span className="hidden sm:inline">Chat nuevo</span>
                </button>
            </div>
        </div>
    )
}