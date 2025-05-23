'use client'

import { useState, useRef, useEffect } from 'react'
import { SendHorizonal, Loader2 } from 'lucide-react'

export default function ChatInput({ onSend }: { onSend: (q: string) => Promise<void> | void }) {
    const [value, setValue] = useState('')
    const [isSending, setIsSending] = useState(false)
    const textareaRef = useRef<HTMLTextAreaElement>(null)

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto'
            textareaRef.current.style.height =
                Math.min(textareaRef.current.scrollHeight, 100) + 'px'
        }
    }, [value])

    const handleSubmit = async () => {
        const trimmed = value.trim()
        if (!trimmed || isSending) return

        setIsSending(true)
        try {
            await onSend(trimmed)
            setValue('')
        } finally {
            setIsSending(false)
        }
    }

    const isDisabled = !value.trim() || isSending

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSubmit()
        }
    }

    return (
        <form onSubmit={e => e.preventDefault()} className="flex items-center md:gap-4 w-full">
            <textarea
                ref={textareaRef}
                rows={2}
                value={value}
                onChange={e => setValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Por favor, haz tu pregunta..."
                disabled={isSending}
                className={`
                    flex-grow min-h-[100px] max-h-[200px] resize-none rounded-md
                    border border-gray-300 dark:border-gray-600
                    bg-gray-50 dark:bg-zinc-800
                    text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500
                    transition-colors duration-200
                    hover:border-gray-400 dark:hover:border-gray-500
                    focus:border-gray-500 focus:ring-1 focus:ring-gray-300
                    dark:focus:border-gray-400 dark:focus:ring-gray-500
                    focus:outline-none
                    p-2 text-sm
                    ${isSending ? 'opacity-70 cursor-not-allowed' : ''}
                `}
            />
            <button
                type="button"
                onClick={handleSubmit}
                disabled={isDisabled}
                className={`
                    flex items-center justify-center h-8 w-8 md:h-10 md:w-10 transition-colors
                    ${isDisabled ? 'text-gray-400 cursor-not-allowed' : 'text-gray-600 hover:text-black dark:text-gray-300 dark:hover:text-white'}
                `}
                aria-label="Enviar mensaje"
            >
                {isSending ? (
                    <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
                ) : (
                    <SendHorizonal className="h-5 w-5" aria-hidden="true" />
                )}
            </button>
        </form>
    )
}
