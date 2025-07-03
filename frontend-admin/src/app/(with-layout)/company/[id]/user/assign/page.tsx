"use client";

import { useEffect } from "react";
import AssignTable from "./AssignTable";
import { Page } from "@/components/Shared/Page";
import { useParams, useRouter } from "next/navigation";
import { PageHeader } from "@/components/Shared/PageHeader";
import { UseGetCompanyById } from "@/hooks/api/lexobot-ai/company/UseGetCompanyById";

export default function AssignUser() {
    const router = useRouter()
    const params = useParams()
    const companyIdRaw = params?.id

    useEffect(() => {
        if (!companyIdRaw || isNaN(Number(companyIdRaw))) {
            router.replace('/company')
        }
    }, [companyIdRaw, router])

    const companyId = companyIdRaw && !isNaN(Number(companyIdRaw)) ? String(companyIdRaw) : undefined

    const { data, isLoading, isError } = UseGetCompanyById(companyId)

    useEffect(() => {
        if (isError) {
            router.replace('/company')
        }
    }, [isError, router])

    return (
        <Page
            header={
                <PageHeader
                    title={`Asignación de usuarios de la compañía: ${isLoading ? '...' : data?.name}`}
                    subtitle="Solo puede agregar usuarios con rol 'Compañía'"
                />
            }
        >
            <AssignTable companyId={companyId} />
        </Page>
    )
}