"use client"

import { useEffect, useState } from "react"
import { Page } from "@/components/Shared/Page"
import { useParams, useRouter } from "next/navigation"
import { PageHeader } from "@/components/Shared/PageHeader"
import { UseMutationCallbacks } from "@/hooks/UseMutationCallbacks"
import { UserForm } from "@/app/(with-layout)/access/user/components/UserForm"
import { UseGetCompanyById } from "@/hooks/api/lexobot-ai/company/UseGetCompanyById"
import { UsePostCompanyUser } from "@/hooks/api/lexobot-ai/company/UsePostCompanyUser"
import { initialValues, User } from "@/app/(with-layout)/access/user/components/UserSchema"

export default function CreateCompanyUserPage() {
    const router = useRouter()
    const params = useParams()
    const companyIdRaw = params?.id
    const [loading, setLoading] = useState(false);

    const closeLoading = () => setLoading(false);

    useEffect(() => {
        if (!companyIdRaw || isNaN(Number(companyIdRaw))) {
            router.replace('/company')
        }
    }, [companyIdRaw, router])

    const companyId = companyIdRaw && !isNaN(Number(companyIdRaw)) ? String(companyIdRaw) : undefined;

    const { data, isLoading, isError } = UseGetCompanyById(companyId)

    useEffect(() => {
        if (isError) {
            router.replace('/company')
        }
    }, [isError, router])

    initialValues.role_id = 2;

    const { mutate: postCompany } = UsePostCompanyUser({ companyId: Number(companyId), ...UseMutationCallbacks('Usuario creado y asignado correctamente', `/company/${companyId}/user`, closeLoading) });

    const handleSubmit = async (data: User) => {
        await postCompany({ user: data, assign: true });
    }

    return (
        <Page
            header={
                <PageHeader
                    title={`Crear usuario nuevo para la compañia: ${isLoading ? '...' : data?.name}`}
                    subtitle="Por favor llene todos los campos"
                />
            }
        >
            <UserForm
                defaultValues={initialValues}
                onSubmit={handleSubmit}
                onloading={loading}
                cancelPath={`/company/${companyId}/user`}
                disableRole
            />
        </Page>
    )
}
