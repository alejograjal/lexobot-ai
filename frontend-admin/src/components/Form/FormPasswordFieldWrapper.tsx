'use client'

import { cn } from '@/lib/utils'
import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { useFormContext, FieldValues, FieldPath } from 'react-hook-form'
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'

type FormPasswordFieldProps<T extends FieldValues> = {
    name: FieldPath<T>
    label: string
    placeholder?: string
    showRules?: boolean
}

export function FormPasswordFieldWrapper<T extends FieldValues>({
    name,
    label,
    placeholder,
    showRules = false,
}: FormPasswordFieldProps<T>) {
    const form = useFormContext<T>()
    const password = form.watch(name) || ""
    const [visible, setVisible] = useState(false)

    const toggleVisibility = () => setVisible(!visible)

    const rules = [
        { label: "Al menos 8 caracteres", test: (v: string) => v.length >= 8 },
        { label: "Una letra mayúscula", test: (v: string) => /[A-Z]/.test(v) },
        { label: "Una letra minúscula", test: (v: string) => /[a-z]/.test(v) },
        { label: "Un número", test: (v: string) => /[0-9]/.test(v) },
        { label: "Un carácter especial", test: (v: string) => /[^a-zA-Z0-9]/.test(v) },
    ]

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
                                {...field}
                                type={visible ? "text" : "password"}
                                value={field.value ?? ""}
                                placeholder={placeholder}
                                className={cn(
                                    form.formState.errors[name] && "border-red-500 focus-visible:ring-red-500",
                                    "pr-10"
                                )}
                            />
                            <button
                                type="button"
                                className="absolute right-2 top-2.5 text-muted-foreground"
                                onClick={toggleVisibility}
                                tabIndex={-1}
                            >
                                {visible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                    </FormControl>
                    <FormMessage />
                    {showRules && (
                        <ul className="mt-2 text-sm space-y-1">
                            {rules.map((rule, i) => (
                                <li key={i} className={rule.test(password) ? "text-green-600" : "text-muted-foreground"}>
                                    • {rule.label}
                                </li>
                            ))}
                        </ul>
                    )}
                </FormItem>
            )}
        />
    )
}
