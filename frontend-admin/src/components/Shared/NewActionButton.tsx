import Link from "next/link"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"

interface NewActionButtonProps {
    path: string
    title: string
}

export default function NewActionButton({ path, title }: NewActionButtonProps) {
    return (
        <Link href={path}>
            <Button variant="default" className="bg-primary text-white hover:bg-primary/90">
                <Plus className="mr-2 h-4 w-4" />
                {title}
            </Button>
        </Link>
    )
}