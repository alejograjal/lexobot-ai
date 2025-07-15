import * as yup from "yup"
import { InferType } from "yup";

export const companyAccessSchema = yup.object({
    issue_at: yup.date().required("Fecha de generación de acceso requerida").typeError("Fecha inválida"),
    expires_at: yup.date().required("Fecha de vencimiento del acceso requerida").typeError("Fecha inválida").test(
        "is-after-acquisition",
        "La fecha de vencimiento debe ser posterior a la de adquisición",
        function (value) {
            const { plan_acquisition_date } = this.parent
            if (!value || !plan_acquisition_date) return true
            return value > plan_acquisition_date
        }
    ),
})

export type CompanyAccess = InferType<typeof companyAccessSchema>

export const initialValues: CompanyAccess = {
    issue_at: new Date(),
    expires_at: new Date()
};
