"use client"

import { ReactNode, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"

interface SidePanelProps {
    title: string
    description?: string
    trigger: ReactNode
    children: ReactNode
    onSubmit?: () => void
    isSaving?: boolean
    submitText?: string
    showCloseButton?: boolean
}

export function SidePanel({
    title,
    description,
    trigger,
    children,
    onSubmit,
    isSaving = false,
    submitText = "Guardar cambios",
    showCloseButton = true,
}: SidePanelProps) {
    const closeRef = useRef<HTMLButtonElement>(null);

    return (
        <Sheet>
            <SheetTrigger asChild>{trigger}</SheetTrigger>
            <SheetContent>
                <SheetHeader className="relative">
                    <SheetTitle>{title}</SheetTitle>
                    {description && <SheetDescription>{description}</SheetDescription>}
                </SheetHeader>

                <div className="grid flex-1 auto-rows-min gap-6 px-4 py-4">
                    {children}
                </div>

                {(onSubmit || showCloseButton) && (
                    <SheetFooter className="px-4 pb-4">
                        {showCloseButton && (
                            <SheetClose asChild>
                                <Button ref={closeRef} variant="outline">Cancelar</Button>
                            </SheetClose>
                        )}
                        {onSubmit && (
                            <Button
                                onClick={() => {
                                    onSubmit?.();
                                    setTimeout(() => {
                                        closeRef.current?.click();
                                    }, 0);
                                }}
                                type="button" disabled={isSaving}>
                                {submitText}
                            </Button>
                        )}
                    </SheetFooter>
                )}
            </SheetContent>
        </Sheet>
    )
}
