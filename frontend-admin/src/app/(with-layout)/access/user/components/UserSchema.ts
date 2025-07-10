import * as yup from "yup"
import { InferType } from "yup";
import { UserCreate } from "@/types/lexobot-ai"

export const initialValues: UserCreate = {
    first_name: "",
    last_name: "",
    email: "",
    role_id: undefined as unknown as number
};

export const userSchema = yup.object({
    first_name: yup.string().required("Nombre requerido"),
    last_name: yup.string().required("Apellidos requerido"),
    email: yup.string().email("Correo inválido").required("Correo requerido"),
    role_id: yup.number().required("Role requerido").min(1, "Role requerido"),
})

export type User = InferType<typeof userSchema>