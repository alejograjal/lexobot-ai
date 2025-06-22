import * as yup from "yup";
import { InferType } from "yup";

export const initialValues = {
    document_name: "",
    file: undefined
};

export const tenantDocumentSchema = yup.object({
    document_name: yup
        .string()
        .required("Nombre del documento requerido")
        .max(255, "El nombre no puede tener más de 255 caracteres"),
    file: yup
        .mixed<File>()
        .required("Archivo requerido")
        .test("fileType", "Solo se permiten archivos PDF", (value) => {
            return value && value.type === "application/pdf";
        })
});

export type TenantDocument = InferType<typeof tenantDocumentSchema>;
