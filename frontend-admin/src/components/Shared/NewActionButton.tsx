import Link from "next/link"
import { Plus } from "lucide-react"
import { Button, type ButtonProps } from "@/components/ui/button"

interface NewActionButtonProps extends ButtonProps {
    path: string
    title: string
    showIcon?: boolean
}

export default function NewActionButton({ path, title, showIcon = true, className, ...props }: NewActionButtonProps) {
    return (
        <Link href={path} className="w-full sm:w-auto">
            <Button variant="default" className={`bg-primary text-white hover:bg-primary/90 ${className ?? ""}`} {...props}>
                {showIcon && <Plus className="mr-2 h-4 w-4" />}
                {title}
            </Button>
        </Link>
    )
}