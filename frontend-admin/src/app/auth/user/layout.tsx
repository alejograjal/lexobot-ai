import { ReactNode } from 'react'

export default function AuthLayout({ children }: { children: ReactNode }) {
    return (
        <div className="min-h-screen sm:bg-gray-900 bg-white flex items-center justify-center p-4 box-border overflow-x-hidden">
            {children}
        </div>
    )
}