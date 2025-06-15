import { Roles } from "@/types/lexobot-ai"
import { type LucideIcon } from "lucide-react"
import { Command, Building2, Settings2, MapPinHouse, LayoutDashboard } from "lucide-react"

export interface ProtectedRouteItem {
    title: string
    url?: string
    icon?: LucideIcon
    isActive?: boolean
    items?: {
        title: string
        url: string
    }[]
}

export const protectedRoutes: ProtectedRouteItem[] = [
    { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
    { title: "Compañias", url: "/company", icon: Building2, },
    { title: "Tenants", url: "/tenant", icon: MapPinHouse },
    {
        title: "Configuración",
        icon: Settings2,
        items: [
            { title: "Categoría de planes", url: "/configuration/plan-category" },
            { title: "Planes", url: "/configuration/plan" },
        ],
    },
    {
        title: "Accesos",
        icon: Command,
        items: [
            { title: "Roles", url: "/access/role" },
            { title: "Usuarios", url: "/access/user" },
        ],
    }
]

export const getRoutesByRole = (role: Roles): ProtectedRouteItem[] => {
    if (role === 'Administrator') return protectedRoutes

    return protectedRoutes
        .map(route => {
            if (!route.items) {
                if (['Dashboard', 'Tenants'].includes(route.title)) return route
                return null
            }

            if (route.title === 'Accesos') {
                if (role === 'Company') {
                    const filteredItems = route.items.filter(item => item.title === 'Usuarios')
                    return filteredItems.length > 0
                        ? { ...route, items: filteredItems }
                        : null
                }
                return null
            }

            return null
        })
        .filter((r): r is ProtectedRouteItem => r !== null)
}