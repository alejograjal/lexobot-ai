import { cn } from "@/lib/utils"
import { HTMLAttributes } from "react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useFormContext, FieldPath, FieldValues } from "react-hook-form"
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form"

type FieldType = "input" | "textarea"

interface CommonProps<T extends FieldValues> {
    name: FieldPath<T>
    label: string
    as?: FieldType
    description?: string
    placeholder?: string
}

type InputProps<T extends FieldValues> = CommonProps<T> & {
    as?: "input"
} & React.InputHTMLAttributes<HTMLInputElement>

type TextareaProps<T extends FieldValues> = CommonProps<T> & {
    as: "textarea"
} & React.TextareaHTMLAttributes<HTMLTextAreaElement>

type FormFieldWrapperProps<T extends FieldValues> = InputProps<T> | TextareaProps<T>

export function FormFieldWrapper<T extends FieldValues>({
    name,
    label,
    as = "input",
    description,
    placeholder,
    ...props
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
                                value={field.value ?? ""}
                                {...(props as React.InputHTMLAttributes<HTMLInputElement>)}
                                placeholder={placeholder}
                                className={cn(
                                    form.formState.errors[name] && "border-red-500 focus-visible:ring-red-500"
                                )}
                            />
                        ) : (
                            <Textarea
                                {...field}
                                value={field.value ?? ""}
                                {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
                                placeholder={placeholder}
                                className={cn(
                                    form.formState.errors[name] && "border-red-500 focus-visible:ring-red-500"
                                )}
                            />
                        )}
                    </FormControl>
                    {description && (
                        <FormDescription>
                            {description}
                        </FormDescription>
                    )}
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
