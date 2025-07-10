import * as yup from 'yup'

export const confirmAccountSchema = yup.object({
    username: yup
        .string()
        .required('El nombre de usuario es requerido')
        .min(6, 'Debe tener al menos 6 caracteres'),
    phone_number: yup
        .string()
        .required('El número de teléfono es requerido')
        .min(8, 'Debe tener al menos 8 caracteres'),
    password: yup
        .string()
        .required('La contraseña es requerida')
        .min(8, 'Debe tener al menos 8 caracteres')
        .matches(/[A-Z]/, 'Debe contener al menos una letra mayúscula')
        .matches(/[a-z]/, 'Debe contener al menos una letra minúscula')
        .matches(/[^a-zA-Z0-9]/, 'Debe contener al menos un carácter especial'),
    confirm_password: yup
        .string()
        .required('La confirmación de contraseña es requerida')
        .oneOf([yup.ref('password')], 'Las contraseñas no coinciden')
})

export type ConfirmAccountFormValues = yup.InferType<typeof confirmAccountSchema>
