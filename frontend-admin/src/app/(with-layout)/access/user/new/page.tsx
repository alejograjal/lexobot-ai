"use client"

import { useState } from "react"
import { Page } from "@/components/Shared/Page"
import { PageHeader } from "@/components/Shared/PageHeader"
import { UseMutationCallbacks } from "@/hooks/UseMutationCallbacks"
import { UsePostUser } from "@/hooks/api/lexobot-ai/user/UsePostUser"
import { UserForm } from "@/app/(with-layout)/access/user/components/UserForm"
import { initialValues, User } from "@/app/(with-layout)/access/user/components/UserSchema"

export default function CreateCompanyPage() {
    const [loading, setLoading] = useState(false);

    const closeLoading = () => setLoading(false);

    const { mutate: postCompany } = UsePostUser(UseMutationCallbacks('Usuario creado correctamente', '/access/user', closeLoading));

    const handleSubmit = async (data: User) => {
        await postCompany({ ...data });
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
            <UserForm
                defaultValues={initialValues}
                onSubmit={handleSubmit}
                onloading={loading}
            />
        </Page>
    )
}
