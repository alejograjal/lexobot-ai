import * as yup from "yup"
import { InferType } from "yup";

export const planSchema = yup.object({
    name: yup.string().required("Nombre requerido"),
    base_price: yup.string().required("Precio base requerido"),
    max_tenants: yup.number().typeError("Cantidad máxima de tenants requerida").required("Cantidad máxima de tenants requerida").min(1, "Valor mínimo 1"),
    plan_category_id: yup.number().required("Categoría de plan requerida").min(1, "Categoría de plan requerida"),
})

export type Plan = InferType<typeof planSchema>

export const initialValues: Plan = {
    name: "",
    base_price: "",
    max_tenants: 0,
    plan_category_id: undefined as unknown as number,
};