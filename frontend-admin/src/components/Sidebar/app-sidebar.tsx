"use client"

import * as React from "react"

import { Roles } from "@/types/lexobot-ai"
import { useAuth } from "@/context/AuthContext"
import { GalleryVerticalEnd, } from "lucide-react"
import { getRoutesByRole } from "@/navigation/Routes"
import { NavMain } from "@/components/Navigation/nav-main"
import { NavUser } from "@/components/Navigation/nav-user"
import { TenantSwitcher } from "@/components/Switcher/tenant-switcher"
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from "@/components/ui/sidebar"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { userProfile } = useAuth()
  const routes = getRoutesByRole(userProfile?.role.name as Roles ?? 'tenant');

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TenantSwitcher />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={routes} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
