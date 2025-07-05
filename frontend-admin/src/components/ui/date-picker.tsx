// components/ui/DatePicker.tsx
"use client"

import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface DatePickerProps {
    label: string
    date?: Date
    setDate: (date: Date | undefined) => void
    maxDate?: Date
}

export function DatePicker({ label, date, setDate, maxDate }: DatePickerProps) {
    return (
        <div className="flex flex-col gap-1">
            <span className="text-sm text-muted-foreground">{label}</span>
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        className={cn(
                            "w-[200px] justify-start text-left font-normal",
                            !date && "text-muted-foreground"
                        )}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date
                            ? format(date, "dd/MM/yyyy", { locale: es })
                            : <span>Seleccionar fecha</span>}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        locale={es}
                        disabled={maxDate ? { after: maxDate } : undefined}
                    />
                </PopoverContent>
            </Popover>
        </div>
    )
}
