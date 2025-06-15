import * as yup from "yup"
import { InferType } from "yup";
import { TenantCreate } from "@/types/lexobot-ai"

export const initialValues: TenantCreate = {
    name: "",
    external_id: "",
    contact_name: "",
    contact_email: "",
    client_count: 0
};

export const tenantSchema = yup.object({
    name: yup.string().required("Nombre requerido"),
    external_id: yup.string()
        .matches(
            /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
            "Identificador externo debe ser un UUID válido"
        )
        .required("Identificador externo requerido"),
    contact_name: yup.string().required("Contacto requerido"),
    contact_email: yup.string().email("Correo inválido").required("Correo requerido"),
    client_count: yup.number().required("Cantidad requerida"),
})

export type Tenant = InferType<typeof tenantSchema>