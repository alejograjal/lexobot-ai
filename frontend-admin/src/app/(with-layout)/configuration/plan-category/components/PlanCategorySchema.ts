import * as yup from "yup"
import { InferType } from "yup"
import { PlanCategoryCreate } from "@/types/lexobot-ai"

export const initialValues: PlanCategoryCreate = {
    name: "",
    description: "",
};

export const planCategorySchema = yup.object({
    name: yup.string().required("Nombre requerido"),
    description: yup.string().required("Descripción requerida"),
})

export type PlanCategory = InferType<typeof planCategorySchema>