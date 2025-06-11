"use client";

import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { useFormContext, FieldPath, FieldValues } from "react-hook-form"
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"

interface FormFieldNumberWrapperProps<T extends FieldValues> {
    name: FieldPath<T>
    label: string
    placeholder?: string
    min?: number
    max?: number
}

export function FormFieldNumberWrapper<T extends FieldValues>({
    name,
    label,
    placeholder
}: FormFieldNumberWrapperProps<T>) {
    const form = useFormContext<T>()

    return (
        <FormField
            control={form.control}
            name={name}
            render={({ field }) => (
                <FormItem>
                    <FormLabel>{label}</FormLabel>
                    <FormControl>
                        <Input
                            type="number"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            step={1}
                            {...field}
                            onKeyDown={(e) => {
                                if (["e", "E", "+", "-", "."].includes(e.key)) {
                                    e.preventDefault()
                                }
                            }}
                            className={cn(
                                form.formState.errors[name] && "border-red-500 focus-visible:ring-red-500"
                            )}
                            placeholder={placeholder}
                        />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    )
}
