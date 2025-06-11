"use client"

import { useState } from "react"
import { Page } from "@/components/Shared/Page"
import { PageHeader } from "@/components/Shared/PageHeader"
import { UseMutationCallbacks } from "@/hooks/UseMutationCallbacks"
import { UsePostPlan } from "@/hooks/api/lexobot-ai/plan/UsePostPlan"
import { PlanForm } from "@/app/(with-layout)/configuration/plan/components/PlanForm"
import { initialValues, Plan } from "@/app/(with-layout)/configuration/plan/components/PlanSchema"

export default function CreateCompanyPage() {
    const [loading, setLoading] = useState(false);

    const closeLoading = () => setLoading(false);

    const { mutate: postCompany } = UsePostPlan(UseMutationCallbacks('Plan creado correctamente', '/configuration/plan', closeLoading));

    const handleSubmit = (data: Plan) => {
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
            <PlanForm
                defaultValues={initialValues}
                onSubmit={handleSubmit}
                onloading={loading}
            />
        </Page>
    )
}
