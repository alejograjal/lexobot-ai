"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronRight } from "lucide-react"
import { ProtectedRouteItem } from "@/navigation/Routes"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem } from "@/components/ui/sidebar"

function renderSingleItem(item: ProtectedRouteItem, pathname: string) {
  const isActive = pathname.startsWith(item.url!)

  return (
    <SidebarMenuItem key={item.title}>
      <SidebarMenuButton asChild tooltip={item.title}>
        <Link href={item.url!} className={isActive ? "text-primary font-semibold" : ""}>
          {item.icon && <item.icon />}
          <span>{item.title}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}

function renderCollapsibleItem(item: ProtectedRouteItem, pathname: string) {
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

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Plataforma</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) =>
          item.items && item.items.length > 0
            ? renderCollapsibleItem(item, pathname)
            : renderSingleItem(item, pathname)
        )}
      </SidebarMenu>
    </SidebarGroup>
  )
} 