import { X } from "lucide-react";
import { Description, Dialog, DialogPanel, DialogTitle } from "@headlessui/react";

interface CharHeaderProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void
}
export function ChatDialogInformation({ isOpen, setIsOpen }: CharHeaderProps) {
    return (
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
    )
}