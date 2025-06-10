import * as yup from "yup"
import { InferType } from "yup"

export const roleSchema = yup.object({
    name: yup.string().required("Nombre requerido"),
    description: yup.string().required("Descripción requerida"),
})

export type Role = InferType<typeof roleSchema>