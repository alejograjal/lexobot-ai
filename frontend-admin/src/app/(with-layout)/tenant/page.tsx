import TenantTable from "./Table";
import { Page } from "@/components/Shared/Page";
import { PageHeader } from "@/components/Shared/PageHeader";
import NewActionButton from "@/components/Shared/NewActionButton";

export default function Company() {
    return (
        <Page
            header={
                <PageHeader
                    title="Tenants"
                    actionButton={<NewActionButton path="/tenant/new" title="Crear tenant" />}
                />
            }
        >
            <TenantTable />
        </Page>
    )
}