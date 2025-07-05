import { PeriodType } from "@/types/lexobot-ai"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

const PERIOD_LABELS: Record<PeriodType, string> = {
    day: "D",
    week: "S",
    month: "M",
}

type PeriodSelectorProps = {
    period: PeriodType
    setPeriod: (value: PeriodType) => void
}

export function PeriodToggleGroup({ period, setPeriod }: PeriodSelectorProps) {
    return (
        <ToggleGroup
            variant="outline"
            type="single"
            value={period}
            onValueChange={(value) => value && setPeriod(value as PeriodType)}
        >
            {Object.entries(PERIOD_LABELS).map(([key, label]) => (
                <ToggleGroupItem
                    key={key}
                    value={key}
                    className={`rounded-md ${period === key ? '!bg-black !text-white' : ''}`}
                >
                    {label}
                </ToggleGroupItem>
            ))}
        </ToggleGroup>
    )
}
