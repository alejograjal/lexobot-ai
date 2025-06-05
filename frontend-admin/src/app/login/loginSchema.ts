import * as yup from "yup"

export const loginSchema = yup.object({
    username: yup.string().required("Email is required"),
    password: yup.string().required("Password is required"),
})

export type LoginFormValues = yup.InferType<typeof loginSchema>