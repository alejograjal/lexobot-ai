"use client"

import React from 'react'
import * as yup from 'yup'
import { Input } from '../ui/input'
import { Textarea } from '../ui/textarea'
import { ArrowRight } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { FormPhoneField } from './FormInputPhone'
import { UseSnackbar } from "@/stores/UseSnackbar"
import { yupResolver } from '@hookform/resolvers/yup'
import { sendBrevoEmail } from '@/clients/brevoClient'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'

interface FormData {
    fullName: string
    email: string
    phone: string
    company: string
    description: string
}

const schema = yup.object({
    fullName: yup.string().required('El nombre es obligatorio').min(3, 'Debe tener al menos 3 caracteres'),
    email: yup.string().email('Email inválido').required('El email es obligatorio'),
    phone: yup.string().required('El teléfono es obligatorio'),
    company: yup.string().required('La empresa es obligatoria'),
    description: yup.string().required('Por favor, cuéntanos sobre tu empresa').min(10, 'Debe tener al menos 10 caracteres'),
}).required()

export const ContactForm = () => {
    const setSnackbarMessage = UseSnackbar((state) => state.setMessage)

    const form = useForm<FormData>({
        resolver: yupResolver(schema),
        mode: 'onTouched',
        defaultValues: {
            fullName: '',
            email: '',
            phone: '',
            company: '',
            description: '',
        },
    })

    const onSubmit = async (data: FormData) => {
        try {
            await sendBrevoEmail(data)
            setSnackbarMessage('Formulario enviado correctamente. ¡Gracias!', 'success');
            form.reset({
                fullName: '',
                email: '',
                company: '',
                phone: '',
                description: '',
            })
        } catch (error) {
            console.error(error)
            setSnackbarMessage('Error enviando el formulario. Por favor, intenta más tarde.', 'error');
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="max-w-2xl mx-auto bg-white/10 backdrop-blur-lg rounded-3xl p-10 border border-white/20 shadow-2xl space-y-6">

                <div className="grid md:grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="fullName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Nombre completo</FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        placeholder="Tu nombre"
                                        className="w-full py-3 px-4 bg-white/10 border rounded-xl text-white placeholder:text-white/60 focus:outline-none transition-all duration-200"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input
                                        type="email"
                                        {...field}
                                        placeholder="tu@email.com"
                                        className="w-full py-3 px-4 bg-white/10 border rounded-xl text-white placeholder:text-white/60 focus:outline-none transition-all duration-200"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="grid md:grid-cols-1 gap-4">
                    <FormField
                        control={form.control}
                        name="company"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Empresa administradora</FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        placeholder="Nombre de tu empresa"
                                        className="w-full py-3 px-4 bg-white/10 border rounded-xl text-white placeholder:text-white/60 focus:outline-none transition-all duration-200"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                    <FormPhoneField name="phone" label="Teléfono" />
                </div>

                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Cuéntanos sobre tu empresa</FormLabel>
                            <FormControl>
                                <Textarea
                                    {...field}
                                    placeholder="Cantidad de condominios que administras, principales desafíos, objetivos..."
                                    className="w-full h-24 p-4 bg-white/10 border rounded-xl text-white placeholder:text-white/60 focus:outline-none transition-all duration-200 resize-none"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <button
                    type="submit"
                    disabled={form.formState.isSubmitting}
                    className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-gray-900 py-4 text-base font-medium rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Solicitar información
                    <ArrowRight className="inline ml-2 h-4 w-4" />
                </button>
            </form>
        </Form>
    )
}
