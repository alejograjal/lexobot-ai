import { AppShell } from "@/components/Layout/AppShell"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/Sidebar/app-sidebar"

export default function WithLayout({ children }: { children: React.ReactNode }) {
    return (
        <SidebarProvider>
            <AppSidebar />
            <AppShell>
                {children}
            </AppShell>
        </SidebarProvider>
    )
}