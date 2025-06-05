"use client"

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { usePathname } from "next/navigation"
import Link from "next/link"

export function DynamicBreadcrumb() {
    const pathname = usePathname()
    const segments = pathname.split("/").filter(Boolean)

    const getLabel = (segment: string) => {
        const map: Record<string, string> = {
            dashboard: "Dashboard",
            users: "Usuarios",
            list: "Lista",
            settings: "Configuración",
        }
        return map[segment] || segment.charAt(0).toUpperCase() + segment.slice(1)
    }

    const buildHref = (index: number) => "/" + segments.slice(0, index + 1).join("/")

    return (
        <Breadcrumb>
            <BreadcrumbList>
                {segments.map((segment, index) => {
                    const isLast = index === segments.length - 1
                    const label = getLabel(segment)
                    const href = buildHref(index)

                    return (
                        <div key={href} className="flex items-center">
                            <BreadcrumbItem>
                                {isLast ? (
                                    <BreadcrumbPage>{label}</BreadcrumbPage>
                                ) : (
                                    <BreadcrumbLink asChild>
                                        <Link href={href}>{label}</Link>
                                    </BreadcrumbLink>
                                )}
                            </BreadcrumbItem>
                            {!isLast && <BreadcrumbSeparator />}
                        </div>
                    )
                })}
            </BreadcrumbList>
        </Breadcrumb>
    )
}
