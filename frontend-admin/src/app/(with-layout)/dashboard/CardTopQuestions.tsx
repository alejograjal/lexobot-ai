import * as React from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
} from "@/components/ui/card"

type TopQuestion = {
    question: string
    count: number
}

type CardTopQuestionsProps = {
    topQuestions: TopQuestion[]
    title?: string
    description?: string
}

export function CardTopQuestions({
    topQuestions,
    title = "Preguntas frecuentes",
}: CardTopQuestionsProps) {
    return (
        <Card className="w-full max-h-[210px]">
            <CardHeader>
                <CardTitle className="text-base">{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <ScrollArea>
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
        </Card>
    )
}
