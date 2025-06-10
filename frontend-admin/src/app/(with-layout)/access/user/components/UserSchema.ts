import * as yup from "yup"
import { InferType } from "yup";
import { UserCreate } from "@/types/lexobot-ai"

export const initialValues: UserCreate = {
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    username: "",
    role_id: 0
};

export const userSchema = yup.object({
    first_name: yup.string().required("Nombre requerido"),
    last_name: yup.string().required("Apellidos requerido"),
    email: yup.string().email("Correo inválido").required("Correo requerido"),
    phone_number: yup.string().required("Teléfono requerido"),
    username: yup.string().required("Nombre de usuario requerido"),
    role_id: yup.number().required("Role requerido").min(1, "Role requerido"),
})

export type User = InferType<typeof userSchema>