import * as yup from "yup"
import { CompanyCreate } from "@/types/lexobot-ai"

export const initialValues: CompanyCreate = {
    name: "",
    email: "",
    legal_id: "",
    address: "",
    phone: "",
    billing_email: "",
    managed_tenants_count: 0
};

export const createCompanySchema = yup.object({
    name: yup.string().required("Nombre requerido"),
    email: yup.string().email("Correo inválido").required("Correo requerido"),
    legal_id: yup.string().required("Cédula requerida"),
    address: yup.string().required("Dirección requerida"),
    phone: yup.string().required("Teléfono requerido"),
    billing_email: yup.string().email("Correo de facturación inválido").required("Correo de facturación requerido"),
    managed_tenants_count: yup.number().required("Cantidad requerida"),
})

export const updateCompanySchema = yup.object({
    name: yup.string().nullable(),
    email: yup.string().email().nullable(),
    legal_id: yup.string().nullable(),
    address: yup.string().nullable(),
    phone: yup.string().nullable(),
    billing_email: yup.string().email().nullable(),
    managed_tenants_count: yup.number().nullable(),
})