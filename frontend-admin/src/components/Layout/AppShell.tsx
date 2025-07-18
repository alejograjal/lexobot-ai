"use client"

import { Toaster } from "sonner"
import { ReactNode } from "react"
import { Separator } from "@/components/ui/separator"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { DynamicBreadcrumb } from "@/components/Layout/DynamicBreadcrumb"

export function AppShell({ children }: { children: ReactNode }) {
    return (
        <>
            <Toaster position="top-center" richColors closeButton />
            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
                    <div className="flex items-center gap-2 px-4">
                        <SidebarTrigger className="-ml-1" />
                        <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
                        <DynamicBreadcrumb />
                    </div>
                </header>
                <main className="flex flex-1 flex-col gap-4 p-4 pt-0">
                    {children}
                </main>
            </SidebarInset>
        </>
    )
}
