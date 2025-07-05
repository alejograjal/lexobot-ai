"use client"

import { ReactNode } from "react"
import { X } from "lucide-react"
import { Button } from "../ui/button"
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger, AlertDialogCancel } from "@/components/ui/alert-dialog"

interface ChoiceDialogProps {
    title: string
    description?: string
    trigger: ReactNode
    footer?: ReactNode
}

export function ChoiceDialog({
    title,
    description,
    trigger,
    footer,
}: ChoiceDialogProps) {
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                {trigger}
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <div className="flex items-center justify-between">
                        <AlertDialogTitle className="text-lg font-semibold leading-none tracking-tight">
                            {title}
                        </AlertDialogTitle>

                        <AlertDialogCancel asChild>
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="text-gray-500 hover:text-gray-700"
                                aria-label="Cerrar"
                            >
                                <X className="w-5 h-5" />
                            </Button>
                        </AlertDialogCancel>
                    </div>

                    {description && (
                        <AlertDialogDescription className="py-2 text-sm text-muted-foreground">
                            {description}
                        </AlertDialogDescription>
                    )}
                </AlertDialogHeader>
                <AlertDialogFooter className="flex justify-between flex-wrap gap-2">
                    {footer}
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
