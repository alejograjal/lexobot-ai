import { ErrorProcess } from "../Shared/ErrorProcess"
import { useFormContext, FieldPath, FieldValues } from "react-hook-form"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface SelectOption {
    value: string
    label: string
}

interface FormSelectWrapperProps<T extends FieldValues> {
    name: FieldPath<T>
    label: string
    options: SelectOption[]
    placeholder?: string
    disabled?: boolean
    errorNote?: string
}

export function FormSelectWrapper<T extends FieldValues>({
    name,
    label,
    options,
    placeholder,
    disabled,
    errorNote
}: FormSelectWrapperProps<T>) {
    const form = useFormContext<T>()

    return (
        <FormField
            control={form.control}
            name={name}
            render={({ field }) => (
                <FormItem>
                    <FormLabel>{label}</FormLabel>
                    {errorNote && (
                        <ErrorProcess message={errorNote} />
                    )}
                    <FormControl>
                        <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            value={field.value === "" || field.value == null ? undefined : String(field.value)}
                            disabled={disabled}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder={placeholder} />
                            </SelectTrigger>
                            <SelectContent>
                                {options.map((option) => (
                                    <SelectItem key={option.value} value={option.value}>
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    )
}
