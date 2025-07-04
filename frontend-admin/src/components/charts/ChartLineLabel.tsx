"use client"

import { TrendingUp } from "lucide-react"
import {
    CartesianGrid,
    LabelList,
    Line,
    LineChart,
    XAxis,
} from "recharts"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"

type ChartLineLabelProps = {
    data: any[]
    config?: ChartConfig
    title?: string
    description?: string
    dataKeyXAxis?: string
    dataKeyYAxis?: string
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
}: ChartLineLabelProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={config} className="aspect-[4/1]">
                    <LineChart
                        accessibilityLayer
                        data={data}
                        margin={{ top: 20, left: 16, right: 16, bottom: 20 }}
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
                                    hideLabel
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
        </Card>
    )
}
