"use client"

import CompanyTable from "./Table";
import { Roles } from "@/types/lexobot-ai";
import { Page } from "@/components/Shared/Page";
import { useAuth } from "@/context/AuthContext";
import { PageHeader } from "@/components/Shared/PageHeader";
import NewActionButton from "@/components/Shared/NewActionButton";

export default function Company() {
    const { userProfile } = useAuth()

    const isAdmin = userProfile?.role.name as Roles === 'Administrator'

    return (
        <Page
            header={
                <PageHeader
                    title="Compañias"
                    actionButton={isAdmin && <NewActionButton path="/company/new" title="Crear compañia" />}
                />
            }
        >
            <CompanyTable />
        </Page>
    )
}