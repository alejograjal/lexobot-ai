"use client"

import { cn } from "@/lib/utils"
import CurrencyInput from "react-currency-input-field"
import { useFormContext, FieldPath, FieldValues } from "react-hook-form"
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"

interface FormCurrencyInputProps<T extends FieldValues> {
    name: FieldPath<T>
    label: string
    placeholder?: string
}

export function FormCurrencyInput<T extends FieldValues>({ name, label, placeholder }: FormCurrencyInputProps<T>) {
    const form = useFormContext<T>()

    return (
        <FormField
            control={form.control}
            name={name}
            render={({ field }) => (
                <FormItem>
                    <FormLabel>{label}</FormLabel>
                    <FormControl>
                        <CurrencyInput
                            id={name}
                            name={name}
                            value={field.value}
                            decimalsLimit={2}
                            intlConfig={{ locale: 'en-US', currency: 'USD', useGrouping: true }}
                            onValueChange={(value) => field.onChange(value)}
                            placeholder={placeholder}
                            className={cn(
                                "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background",
                                "placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                                form.formState.errors[name] && "border-red-500 focus-visible:ring-red-500"
                            )}
                        />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    )
}
