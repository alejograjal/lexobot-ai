import * as yup from 'yup'

export const resetPasswordSchema = yup.object({
    email: yup
        .string()
        .required('El correo es requerido')
        .email('El correo es inválido'),
})

export type ResetPasswordFormValues = yup.InferType<typeof resetPasswordSchema>