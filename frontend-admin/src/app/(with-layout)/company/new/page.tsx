"use client"

import { useState } from "react"
import { Page } from "@/components/Shared/Page"
import { PageHeader } from "@/components/Shared/PageHeader"
import { UseMutationCallbacks } from "@/hooks/UseMutationCallbacks"
import { Company, initialValues } from "../components/CompanySchema"
import { UsePostCompany } from "@/hooks/api/lexobot-ai/company/UsePostCompany"
import { CompanyForm } from "@/app/(with-layout)/company/components/CompanyForm"

export default function CreateCompanyPage() {
    const [loading, setLoading] = useState(false);

    const closeLoading = () => setLoading(false);

    const { mutate: postCompany } = UsePostCompany(UseMutationCallbacks('Compañía creada correctamente', '/company', closeLoading));

    const handleSubmit = async (data: Company) => {
        await postCompany({ ...data });
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
            <CompanyForm
                defaultValues={initialValues}
                onSubmit={handleSubmit}
                onloading={loading}
            />
        </Page>
    )
}
