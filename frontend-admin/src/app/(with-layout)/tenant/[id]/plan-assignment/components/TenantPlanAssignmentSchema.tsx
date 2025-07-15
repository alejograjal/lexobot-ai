import * as yup from "yup"
import { InferType } from "yup";

export const tenantPlanAssignmentSchema = yup.object({
    planId: yup.number().required("Plan requerido").min(1, "Plan requerido"),
    assigned_at: yup.date().required("Fecha de adquisición del plan requerida").typeError("Fecha inválida"),
    expires_at: yup.date().required("Fecha de vencimiento del plan requerida").typeError("Fecha inválida").test(
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

export type TenantPlanAssignment = InferType<typeof tenantPlanAssignmentSchema>

export const initialValues: TenantPlanAssignment = {
    planId: undefined as unknown as number,
    assigned_at: new Date(),
    expires_at: new Date(),
    auto_renewal: false
};
