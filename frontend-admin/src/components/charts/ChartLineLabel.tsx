"use client"

import React from "react"
import { CartesianGrid, LabelList, Line, LineChart, XAxis } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { CircularLoadingProgress } from "../Shared/CircularLoadingProgress"
import { ErrorProcess } from "../Shared/ErrorProcess"

type ChartLineLabelProps = {
    data: any[]
    config?: ChartConfig
    title?: string
    description?: string
    dataKeyXAxis?: string
    dataKeyYAxis?: string
    toggleGroup?: React.ReactNode
    isLoading?: boolean
    isError?: boolean
}

export function ChartLineLabel({
    data,
    config = {
        desktop: {
            label: "Desktop",
            color: "black",
        },
        mobile: {
            label: "Mobile",
            color: "black",
        },
    },
    title = "Line Chart",
    description = "",
    dataKeyXAxis = "",
    dataKeyYAxis = "",
    toggleGroup,
    isLoading = false,
    isError = false
}: ChartLineLabelProps) {
    const getContent = () => {
        if (isLoading) {
            return <CircularLoadingProgress />
        }

        if (isError) {
            return <ErrorProcess message="Ha ocurrido un error al momento de consultar la información" />
        }

        return (
            <>
                <CardHeader className="flex flex-row items-start justify-between space-y-0">
                    <div className="flex flex-col space-y-1">
                        <CardTitle>{title}</CardTitle>
                        <CardDescription>{description}</CardDescription>
                    </div>
                    {
                        toggleGroup && toggleGroup
                    }
                </CardHeader>
                <CardContent>
                    <ChartContainer config={config} className="md:aspect-[4/1]">
                        <LineChart
                            accessibilityLayer
                            data={data}
                            margin={{ top: 20, left: 18, right: 18, bottom: 20 }}
                        >
                            <CartesianGrid vertical={false} />
                            <XAxis
                                dataKey={dataKeyXAxis}
                                tickLine={false}
                                axisLine={false}
                                tickMargin={8}
                                tickFormatter={(value) => value}
                            />
                            <ChartTooltip
                                cursor={false}
                                content={
                                    <ChartTooltipContent
                                        indicator="line"
                                        nameKey="date"
                                    />
                                }
                            />
                            <Line
                                name="Preguntas"
                                dataKey={dataKeyYAxis}
                                type="natural"
                                stroke="var(--color-desktop)"
                                strokeWidth={2}
                                dot={{ fill: "var(--color-desktop)" }}
                                activeDot={{ r: 6 }}
                            >
                                <LabelList
                                    position="top"
                                    offset={12}
                                    className="fill-foreground"
                                    fontSize={12}
                                />
                            </Line>
                        </LineChart>
                    </ChartContainer>
                </CardContent>
            </>
        )

    }
    return (
        <Card className="bg-muted min-h-72">
            {getContent()}
        </Card>
    )
}
