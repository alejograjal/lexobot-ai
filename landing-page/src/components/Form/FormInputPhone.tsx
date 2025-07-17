"use client"

import React from "react"
import { REGEXP_ONLY_DIGITS } from "input-otp"
import { useFormContext, FieldPath, FieldValues } from "react-hook-form"
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "@/components/ui/input-otp"

interface FormPhoneFieldProps<T extends FieldValues> {
    name: FieldPath<T>
    label: string
}

export function FormPhoneField<T extends FieldValues>({ name, label }: FormPhoneFieldProps<T>) {
    const form = useFormContext<T>()

    return (
        <FormField
            control={form.control}
            name={name}
            render={({ field }) => {
                const handleChange = (val: string) => {
                    const cleanVal = val.replace(/\D/g, "").slice(0, 8)
                    field.onChange(cleanVal)
                }

                return (
                    <FormItem>
                        <FormLabel>{label}</FormLabel>
                        <FormControl>
                            <InputOTP
                                maxLength={8}
                                pattern={REGEXP_ONLY_DIGITS}
                                value={field.value ?? ""}
                                onChange={(e) => handleChange(e)}
                                onBlur={field.onBlur}
                                name={field.name}
                            >
                                <InputOTPGroup>
                                    <InputOTPSlot index={0} />
                                    <InputOTPSlot index={1} />
                                    <InputOTPSlot index={2} />
                                    <InputOTPSlot index={3} />
                                </InputOTPGroup>
                                <InputOTPSeparator>-</InputOTPSeparator>
                                <InputOTPGroup>
                                    <InputOTPSlot index={4} />
                                    <InputOTPSlot index={5} />
                                    <InputOTPSlot index={6} />
                                    <InputOTPSlot index={7} />
                                </InputOTPGroup>
                            </InputOTP>
                        </FormControl>
                        {form.formState.errors[name] && (
                            <FormMessage>
                                * {(form.formState.errors[name]?.message as string) ?? "Campo inválido"}
                            </FormMessage>
                        )}
                    </FormItem>
                )
            }}
        />
    )
}