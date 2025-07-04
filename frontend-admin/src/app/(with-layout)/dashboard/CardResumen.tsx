import { ArrowDownRight } from "lucide-react"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

type CardResumenProps = {
    title: string
    total: number
    diffPercent?: number
    subtitle?: string
    description?: string
}

export function CardResumen({
    title,
    total,
    subtitle = "",
    description = "",
}: CardResumenProps) {

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                <CardDescription className="text-xs text-muted-foreground">{subtitle}</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="text-3xl font-bold">{total.toLocaleString("es-CR")}</div>
                <p className="text-xs text-muted-foreground">{description}</p>
            </CardContent>
        </Card>
    )
}
