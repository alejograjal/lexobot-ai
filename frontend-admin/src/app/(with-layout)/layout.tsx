import { AppShell } from "@/components/Layout/AppShell"
import { SidebarProvider } from "@/components/ui/sidebar"
import { ProtectedRoute } from "@/navigation/ProtectedRoute"
import { AppSidebar } from "@/components/Sidebar/app-sidebar"

export default function WithLayout({ children }: { children: React.ReactNode }) {
    return (
        <ProtectedRoute>
            <SidebarProvider>
                <AppSidebar />
                <AppShell>
                    {children}
                </AppShell>
            </SidebarProvider>
        </ProtectedRoute>
    )
}