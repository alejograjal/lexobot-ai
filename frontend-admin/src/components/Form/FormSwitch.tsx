import { Switch } from "@/components/ui/switch"
import { useFormContext, FieldPath, FieldValues } from "react-hook-form"
import { FormField, FormItem, FormLabel, FormControl, FormMessage, } from "@/components/ui/form"

interface FormSwitchProps<T extends FieldValues> {
    name: FieldPath<T>
    label: string
    disabled?: boolean
}

export function FormSwitch<T extends FieldValues>({ name, label, disabled }: FormSwitchProps<T>) {
    const form = useFormContext<T>()

    return (
        <FormField
            control={form.control}
            name={name}
            render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm">
                    <div className="space-y-0.5">
                        <FormLabel className="text-base">{label}</FormLabel>
                    </div>
                    <FormControl>
                        <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            id={name}
                            disabled={disabled}
                        />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    )
}
