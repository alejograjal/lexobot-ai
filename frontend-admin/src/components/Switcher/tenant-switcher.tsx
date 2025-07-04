"use client"

import * as React from "react"
import { ChevronsUpDown } from "lucide-react"
import { GalleryVerticalEnd } from "lucide-react"
import { TenantResponse } from "@/types/lexobot-ai"
import { useTenantSelectionStore } from "@/stores/UseTenantSelectionStore"
import { UseGetTenants } from "@/hooks/api/lexobot-ai/tenant/UseGetTenants"
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuShortcut, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export function TenantSwitcher() {
  const { isMobile } = useSidebar()
  const [activeTeam, setActiveTeam] = React.useState<TenantResponse>()
  const { setTenantId, clearTenantId } = useTenantSelectionStore()

  const { data, isLoading, isError } = UseGetTenants()

  React.useEffect(() => {
    if (data) {
      setActiveTeam(data[0])
      setTenantId(data[0].id)
    }
  }, [data, setTenantId])

  React.useEffect(() => {
    if (isError) {
      clearTenantId()
    }
  }, [isError, clearTenantId])

  React.useEffect(() => {
    if (!activeTeam) {
      clearTenantId()
    }
  }, [activeTeam, clearTenantId])

  if (isError || !activeTeam) return null

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                <GalleryVerticalEnd className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{activeTeam.name}</span>
                <span className="truncate text-xs">Asociados: {activeTeam.client_count}</span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-muted-foreground text-xs">
              Tenants
            </DropdownMenuLabel>
            {isLoading || !data ? null : data.map((tenant, index) => (
              <DropdownMenuItem
                key={tenant.name}
                onClick={() => {
                  setActiveTeam(tenant)
                  setTenantId(tenant.id)
                }}
                className="gap-2 p-2"
              >
                {tenant.name}
                <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
