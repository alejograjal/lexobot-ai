import CompanyTable from "./Table";
import { Page } from "@/components/Shared/Page";
import { PageHeader } from "@/components/Shared/PageHeader";
import NewActionButton from "@/components/Shared/NewActionButton";

export default function Company() {
    return (
        <Page
            header={
                <PageHeader
                    title="Roles"
                    actionButton={<NewActionButton path="/access/roles/new" title="Crear rol" />}
                />
            }
        >
            <CompanyTable />
        </Page>
    )
}