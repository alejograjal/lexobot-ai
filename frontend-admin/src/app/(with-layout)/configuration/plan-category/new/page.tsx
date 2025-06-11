"use client"

import { useState } from "react"
import { Page } from "@/components/Shared/Page"
import { PageHeader } from "@/components/Shared/PageHeader"
import { UseMutationCallbacks } from "@/hooks/UseMutationCallbacks"
import { UsePostPlanCategory } from "@/hooks/api/lexobot-ai/planCategory/UsePostPlanCategory"
import { PlanCategoryForm } from "@/app/(with-layout)/configuration/plan-category/components/PlanCategoryForm"
import { initialValues, PlanCategory } from "@/app/(with-layout)/configuration/plan-category/components/PlanCategorySchema"

export default function CreateCompanyPage() {
    const [loading, setLoading] = useState(false);

    const closeLoading = () => setLoading(false);

    const { mutate: postCompany } = UsePostPlanCategory(UseMutationCallbacks('Categoría de plan creada correctamente', '/configuration/plan-category', closeLoading));

    const handleSubmit = (data: PlanCategory) => {
        postCompany({ ...data });
    }

    return (
        <Page
            header={
                <PageHeader
                    title="Crear usuario nuevo"
                    subtitle="Por favor llene todos los campos"
                />
            }
        >
            <PlanCategoryForm
                defaultValues={initialValues}
                onSubmit={handleSubmit}
                onloading={loading}
            />
        </Page>
    )
}
