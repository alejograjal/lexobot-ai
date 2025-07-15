"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { format, parse } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { useFormContext, FieldPath, FieldValues } from "react-hook-form"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { es } from "date-fns/locale/es"

interface FormDatePickerProps<T extends FieldValues> {
    name: FieldPath<T>
    label: string
    placeholder?: string
    disabled?: boolean
}

function isValidDateInstance(val: unknown): val is Date {
    return val instanceof Date && !isNaN(val.getTime())
}

export function FormDatePicker<T extends FieldValues>({
    name,
    label,
    placeholder = "dd/MM/yyyy",
    disabled = false
}: FormDatePickerProps<T>) {
    const form = useFormContext<T>()

    const fieldValue = form.getValues(name)
    const parsedDate =
        typeof fieldValue === "string"
            ? parse(fieldValue, "dd/MM/yyyy", new Date())
            : isValidDateInstance(fieldValue)
                ? fieldValue
                : undefined

    const [inputValue, setInputValue] = useState(
        parsedDate && !isNaN(parsedDate.getTime()) ? format(parsedDate, "dd/MM/yyyy") : ""
    )

    const [open, setOpen] = useState(false)
    const [month, setMonth] = useState<Date>(
        parsedDate && !isNaN(parsedDate.getTime()) ? parsedDate : new Date()
    )

    const handleManualInput = (value: string, onChange: (val: any) => void) => {
        setInputValue(value)
        const parsed = parse(value, "dd/MM/yyyy", new Date())
        if (!isNaN(parsed.getTime())) {
            onChange(parsed)
            setMonth(parsed)
        }
    }

    return (
        <FormField
            control={form.control}
            name={name}
            render={({ field }) => (
                <FormItem>
                    <FormLabel>{label}</FormLabel>
                    <FormControl>
                        <div className="relative">
                            <Input
                                value={inputValue}
                                placeholder={placeholder}
                                onChange={(e) => handleManualInput(e.target.value, field.onChange)}
                                onKeyDown={(e) => {
                                    if (e.key === "ArrowDown") {
                                        e.preventDefault()
                                        setOpen(true)
                                    }
                                }}
                                className={cn(
                                    "pr-10",
                                    form.formState.errors[name] && "border-red-500 focus-visible:ring-red-500"
                                )}
                                disabled={disabled}
                            />
                            <Popover open={open} onOpenChange={setOpen}>
                                <PopoverTrigger asChild>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        className="absolute top-1/2 right-2 size-6 -translate-y-1/2"
                                        tabIndex={-1}
                                        disabled={disabled}
                                    >
                                        <CalendarIcon className="size-4" />
                                        <span className="sr-only">Seleccione una fecha</span>
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="end">
                                    <Calendar
                                        mode="single"
                                        selected={parsedDate}
                                        locale={es}
                                        onSelect={(date) => {
                                            if (date) {
                                                setInputValue(format(date, "dd/MM/yyyy"))
                                                field.onChange(date)
                                                setMonth(date)
                                                setOpen(false)
                                            }
                                        }}
                                        captionLayout="dropdown"
                                        month={month}
                                        onMonthChange={setMonth}
                                        disabled={disabled}
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    )
}