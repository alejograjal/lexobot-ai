import * as yup from "yup"
import { InferType } from "yup";

export const companyAccessSchema = yup.object({
    plan_id: yup.number().required("Plan requerido").min(1, "Plan requerido"),
    plan_acquisition_date: yup.date().required("Fecha de adquisición del plan requerida").typeError("Fecha inválida"),
    plan_expiration_date: yup.date().required("Fecha de vencimiento del plan requerida").typeError("Fecha inválida").test(
        "is-after-acquisition",
        "La fecha de vencimiento debe ser posterior a la de adquisición",
        function (value) {
            const { plan_acquisition_date } = this.parent
            if (!value || !plan_acquisition_date) return true
            return value > plan_acquisition_date
        }
    ),
    auto_renewal: yup.boolean().required("Renovación automática requerida"),
})

export type CompanyAccess = InferType<typeof companyAccessSchema>

export const initialValues: CompanyAccess = {
    plan_id: undefined as unknown as number,
    plan_acquisition_date: new Date(),
    plan_expiration_date: new Date(),
    auto_renewal: false
};
