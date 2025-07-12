import * as yup from "yup"
import { InferType } from "yup";
import { UserUpdate } from "@/types/lexobot-ai"

export const accountInitialValues: UserUpdate = {
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    username: "",
    role_id: undefined as unknown as number
};

export const accountSchema = yup.object({
    first_name: yup.string().required("Nombre requerido"),
    last_name: yup.string().required("Apellidos requerido"),
    email: yup.string().email("Correo inválido").required("Correo requerido"),
    phone_number: yup.string().required("Teléfono requerido"),
    username: yup.string().required("Username requerido"),
    role_id: yup.number().required("Role requerido").min(1, "Role requerido"),
})

export type Account = InferType<typeof accountSchema>