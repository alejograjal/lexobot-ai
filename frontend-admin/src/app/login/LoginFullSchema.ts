import * as yup from "yup"

export const loginSchema = yup.object({
    username: yup.string().required("Nombre de usuario requerido"),
    password: yup.string().required("Contraseña requerida"),
})

export type LoginFormValues = yup.InferType<typeof loginSchema>