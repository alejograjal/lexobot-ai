import * as yup from "yup"
import { InferType } from "yup";
import { TenantCreate } from "@/types/lexobot-ai"

export const initialValues: TenantCreate = {
    name: "",
    contact_name: "",
    contact_email: "",
    client_count: 0
};

export const tenantSchema = yup.object({
    name: yup.string().required("Nombre requerido"),
    contact_name: yup.string().required("Contacto requerido"),
    contact_email: yup.string().email("Correo inválido").required("Correo requerido"),
    client_count: yup.number().required("Cantidad requerida"),
})

export type Tenant = InferType<typeof tenantSchema>