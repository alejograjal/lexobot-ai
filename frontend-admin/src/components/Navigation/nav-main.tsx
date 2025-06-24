"use client"

import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { usePathname } from "next/navigation"
import { useSidebar } from "@/components/ui/sidebar"
import { ProtectedRouteItem } from "@/navigation/Routes"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem } from "@/components/ui/sidebar"

function renderSingleItem(item: ProtectedRouteItem, pathname: string, closeMobileSidebar = () => { }) {
  const isActive = pathname.startsWith(item.url!)

  return (
    <SidebarMenuItem key={item.title}>
      <SidebarMenuButton asChild tooltip={item.title}>
        <Link href={item.url!} onClick={closeMobileSidebar} className={isActive ? "text-primary font-semibold" : ""}>
          {item.icon && <item.icon />}
          <span>{item.title}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}

function renderCollapsibleItem(item: ProtectedRouteItem, pathname: string, closeMobileSidebar = () => { }) {
  return (
    <Collapsible
      key={item.title}
      asChild
      defaultOpen={item.isActive}
      className="group/collapsible"
    >
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton tooltip={item.title}>
            {item.icon && <item.icon />}
            <span>{item.title}</span>
            <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub>
            {item.items!.map((subItem) => {
              const isActive = pathname === subItem.url || pathname.startsWith(`${subItem.url}/`);

              return (
                <SidebarMenuSubItem key={subItem.title}>
                  <SidebarMenuSubButton asChild>
                    <Link
                      href={subItem.url}
                      className={isActive ? "text-primary font-semibold" : ""}
                      onClick={closeMobileSidebar}
                    >
                      <span>{subItem.title}</span>
                    </Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              )
            })}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  )
}

export function NavMain({ items }: { items: ProtectedRouteItem[] }) {
  const pathname = usePathname()
  const { setOpenMobile, isMobile } = useSidebar()

  const closeMobileSidebar = () => {
    if (isMobile) {
      setOpenMobile(false)
    }
  }

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Plataforma</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) =>
          item.items && item.items.length > 0
            ? renderCollapsibleItem(item, pathname, closeMobileSidebar)
            : renderSingleItem(item, pathname, closeMobileSidebar)
        )}
      </SidebarMenu>
    </SidebarGroup>
  )
} 