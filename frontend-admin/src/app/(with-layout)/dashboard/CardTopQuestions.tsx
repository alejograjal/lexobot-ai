import * as React from "react"
import { TotalQuestions } from "@/types/lexobot-ai"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ErrorProcess } from "@/components/Shared/ErrorProcess"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { CircularLoadingProgress } from "@/components/Shared/CircularLoadingProgress"

type CardTopQuestionsProps = {
    topQuestions: TotalQuestions[]
    title?: string
    description?: string
    isLoading?: boolean
    isError?: boolean
}

export function CardTopQuestions({
    topQuestions,
    title = "Preguntas frecuentes",
    isLoading = false,
    isError = false
}: CardTopQuestionsProps) {

    const getContent = () => {
        if (isLoading) {
            return <CircularLoadingProgress />
        }

        if (isError) {
            return <ErrorProcess message="Ha ocurrido un error al momento de consultar la información" />
        }

        return (
            <>
                <CardHeader>
                    <CardTitle className="text-base">{title}</CardTitle>
                </CardHeader>
                <CardContent>
                    <ScrollArea className="h-15 md:h-full">
                        <div className="p-4">
                            {topQuestions.length === 0 && (
                                <div className="text-muted-foreground text-sm">No hay preguntas registradas.</div>
                            )}
                            {topQuestions.map((item, index) => (
                                <React.Fragment key={index}>
                                    <div className="text-sm flex justify-between">
                                        <span className="mr-4">{item.question}</span>
                                        <span className="font-mono text-muted-foreground">×{item.count}</span>
                                    </div>
                                    {index < topQuestions.length - 1 && <Separator className="my-2" />}
                                </React.Fragment>
                            ))}
                        </div>
                    </ScrollArea>
                </CardContent>
            </>
        )
    }



    return (
        <Card className="w-full h-full max-h-[300px] md:max-h-[300px] bg-muted">
            {getContent()}
        </Card>
    )
}
