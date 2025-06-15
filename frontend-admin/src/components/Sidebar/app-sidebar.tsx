"use client"

import * as React from "react"

import { Roles } from "@/types/lexobot-ai"
import { useAuth } from "@/context/AuthContext"
import { GalleryVerticalEnd, } from "lucide-react"
import { getRoutesByRole } from "@/navigation/Routes"
import { NavMain } from "@/components/Navigation/nav-main"
import { NavUser } from "@/components/Navigation/nav-user"
import { TeamSwitcher } from "@/components/Switcher/team-switcher"
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from "@/components/ui/sidebar"

const data = {
  teams: [
    {
      name: "Lexobot AI",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    }
  ]
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { userProfile } = useAuth()
  const routes = getRoutesByRole(userProfile?.role.name as Roles ?? 'tenant');

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
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
