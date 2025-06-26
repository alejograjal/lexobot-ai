'use client'

import { useState } from 'react'
import { BrushCleaning, Info, X } from 'lucide-react'
import { Description, Dialog, DialogPanel, DialogTitle } from '@headlessui/react'

interface Props {
    onClear: () => void
}

export default function ChatHeader({ onClear }: Props) {
    const [isOpen, setIsOpen] = useState(false)

    const buttonClean = () => {
        return (
            <button
                onClick={onClear}
                className="bg-white/90 dark:bg-black/70 text-gray-700 dark:text-gray-300 px-3 py-1 mr-1 mt-1 rounded-lg shadow-md hover:bg-white dark:hover:bg-black transition focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center gap-1"
                type="button"
                aria-label="Limpiar chat"
                title="Limpiar chat"
            >
                <BrushCleaning className="w-5 h-5" />
                <span className="hidden sm:inline">Limpiar chat</span>
            </button>
        )
    }

    return (
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-4 px-2 sm:px-0">
            <div className="hidden sm:block">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl md:text-2xl font-bold mb-1">Conversa con LexoBot-AI</h1>
                    {buttonClean()}
                </div>
                <p className="text-gray-700 dark:text-gray-300 text-xs md:text-sm leading-relaxed text-justify">
                    Aquí puedes consultar cualquier duda sobre los reglamentos internos del condominio.
                    LexoBot está diseñado para ayudarte a conocer las reglas de convivencia.
                </p>
            </div>

            <div className="sm:hidden flex justify-between items-center w-full">
                <div className="flex items-center gap-2">
                    <button
                        className="text-gray-600 dark:text-gray-300"
                        onClick={() => setIsOpen(true)}
                        aria-label="Ver información"
                    >
                        <Info className="w-5 h-5" />
                    </button>
                    <h1 className="text-lg font-bold">Conversa con LexoBot-AI</h1>
                </div>

                {buttonClean()}
            </div>

            <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
                <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
                <div className="fixed inset-0 flex items-center justify-center p-4">
                    <DialogPanel className="bg-white dark:bg-gray-900 p-6 rounded-lg max-w-md w-full shadow-lg">
                        <DialogTitle className="text-lg font-bold mb-2">Acerca de LexoBot-AI</DialogTitle>
                        <Description className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                            Aquí puedes consultar cualquier duda sobre los reglamentos internos del condominio.
                            LexoBot está diseñado para ayudarte a conocer las reglas de convivencia.
                        </Description>
                        <div className="mt-4 flex justify-end">
                            <button
                                onClick={() => setIsOpen(false)}
                                className="px-3 py-1 rounded bg-blue-600 text-white hover:bg-indigo-700 transition"
                            >
                                <X className="w-4 h-4 inline-block" />
                            </button>
                        </div>
                    </DialogPanel>
                </div>
            </Dialog>
        </div>
    )
}
