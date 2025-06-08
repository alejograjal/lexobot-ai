import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useFormContext, FieldPath, FieldValues } from "react-hook-form"
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"

type FieldType = "input" | "textarea"

interface FormFieldWrapperProps<T extends FieldValues> {
    name: FieldPath<T>
    label: string
    as?: FieldType
    placeholder?: string
}

export function FormFieldWrapper<T extends FieldValues>({
    name,
    label,
    as = "input",
    placeholder
}: FormFieldWrapperProps<T>) {
    const form = useFormContext<T>()

    return (
        <FormField
            control={form.control}
            name={name}
            render={({ field }) => (
                <FormItem>
                    <FormLabel>{label}</FormLabel>
                    <FormControl>
                        {as === "input" ? (
                            <Input
                                {...field}
                                placeholder={placeholder}
                                className={cn(
                                    form.formState.errors[name] && "border-red-500 focus-visible:ring-red-500"
                                )}
                            />
                        ) : (
                            <Textarea
                                {...field}
                                placeholder={placeholder}
                                className={cn(
                                    form.formState.errors[name] && "border-red-500 focus-visible:ring-red-500"
                                )}
                            />
                        )}
                    </FormControl>
                    {form.formState.errors[name] && (
                        <FormMessage>
                            * {(form.formState.errors[name]?.message as string) ?? "Campo inválido"}
                        </FormMessage>
                    )}
                </FormItem>
            )}
        />
    )
}
