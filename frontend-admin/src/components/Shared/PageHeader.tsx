'use client'

import { useIsMobile } from "@/hooks/use-mobile"

interface PageHeaderProps {
    children?: React.ReactNode
    title: string
    subtitle?: string
    actionButton?: React.ReactNode
}

export const PageHeader = ({
    children,
    title,
    subtitle,
    actionButton,
}: PageHeaderProps) => {
    const isMobile = useIsMobile()

    return (
        <div className="py-4">
            <div className={`flex w-full flex-col ${isMobile ? "" : "md:flex-row md:items-end md:justify-between"}`}>
                <div className={`w-full ${isMobile ? "text-center" : "text-left"}`}>
                    <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
                    {subtitle && (
                        <p className="text-muted-foreground text-sm">{subtitle}</p>
                    )}
                    {children && <div className="mt-2">{children}</div>}
                </div>

                {actionButton && (
                    <div className={`w-full mt-4 ${isMobile ? "text-center" : "mt-0 text-right"}`}>
                        {actionButton}
                    </div>
                )}
            </div>
        </div >
    )
}
