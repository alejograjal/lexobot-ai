'use client'

export const Page = ({
    children,
    header,
}: {
    children: React.ReactNode
    header?: React.ReactNode
}) => {
    return (
        <div className="flex-1 relative overflow-y-auto overflow-x-hidden">
            {header && (
                <div className="sm:px-8">
                    {header}
                </div>
            )}

            <div className="pb-8 sm:px-8 sm:pb-12">
                {children}
            </div>
        </div>
    )
}
