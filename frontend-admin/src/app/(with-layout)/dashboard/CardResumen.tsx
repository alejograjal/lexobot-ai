import { ErrorProcess } from "@/components/Shared/ErrorProcess"
import { CircularLoadingProgress } from "@/components/Shared/CircularLoadingProgress"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

type CardResumeProps = {
    title: string
    total: number
    diffPercent?: number
    subtitle?: string
    description?: string
    isLoading?: boolean,
    isError?: boolean
}

export function CardResume({
    title,
    total,
    subtitle = "",
    description = "",
    isLoading = false,
    isError = false
}: CardResumeProps) {

    const getContent = () => {
        if (isLoading) {
            return <CircularLoadingProgress />
        }

        if (isError) {
            return <ErrorProcess message="Ha ocurrido un error al momento de consultar la información" />
        }

        return (
            <>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{title}</CardTitle>
                    <CardDescription className="text-xs text-muted-foreground">{subtitle}</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="text-3xl font-bold">{total.toLocaleString("es-CR")}</div>
                    <p className="text-xs text-muted-foreground">{description}</p>
                </CardContent>
            </>
        )
    }

    return (
        <Card className="bg-muted">
            {getContent()}
        </Card>
    )
}
