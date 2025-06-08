"use client"

import { useState } from "react"
import type { InferType } from "yup"
import { Page } from "@/components/Shared/Page"
import { PageHeader } from "@/components/Shared/PageHeader"
import { UseMutationCallbacks } from "@/hooks/UseMutationCallbacks"
import { UsePostCompany } from "@/hooks/api/lexobot-ai/company/UsePostCompany"
import { CompanyForm } from "@/app/(with-layout)/company/components/CompanyForm"
import { createCompanySchema, initialValues } from "@/app/(with-layout)/company/components/CompanySchema"

type CompanyCreate = InferType<typeof createCompanySchema>

export default function CreateCompanyPage() {
    const [loading, setLoading] = useState(false);

    const closeLoading = () => setLoading(false);

    const { mutate: postCompany } = UsePostCompany(UseMutationCallbacks('Compañia creada correctamente', '/company', closeLoading));

    const handleSubmit = (data: CompanyCreate) => {
        postCompany({ ...data });
    }

    return (
        <Page
            header={
                <PageHeader
                    title="Crear compañia nueva"
                    subtitle="Por favor llene todos los campos"
                />
            }
        >
            <CompanyForm<CompanyCreate>
                schema={createCompanySchema}
                defaultValues={initialValues}
                onSubmit={handleSubmit}
                onloading={loading}
            />
        </Page>
    )
}
