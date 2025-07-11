import * as yup from 'yup'

export const changePasswordSchema = yup.object({
    email: yup
        .string()
        .required('El correo es requerido')
        .email('El correo es inválido'),
    new_password: yup
        .string()
        .required('La contraseña es requerida')
        .min(8, 'Debe tener al menos 8 caracteres')
        .matches(/[A-Z]/, 'Debe contener al menos una letra mayúscula')
        .matches(/[a-z]/, 'Debe contener al menos una letra minúscula')
        .matches(/[^a-zA-Z0-9]/, 'Debe contener al menos un carácter especial'),
    confirm_password: yup
        .string()
        .required('La confirmación de contraseña es requerida')
        .oneOf([yup.ref('new_password')], 'Las contraseñas no coinciden')
})

export type ChangePasswordFormValues = yup.InferType<typeof changePasswordSchema>