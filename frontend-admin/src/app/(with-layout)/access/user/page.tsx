import CompanyTable from "./Table";
import { Page } from "@/components/Shared/Page";
import { PageHeader } from "@/components/Shared/PageHeader";
import NewActionButton from "@/components/Shared/NewActionButton";

export default function User() {
    return (
        <Page
            header={
                <PageHeader
                    title="Usuarios"
                    actionButton={<NewActionButton path="/access/user/new" title="Crear usuario" className="sm:w-auto w-full" />}
                />
            }
        >
            <CompanyTable />
        </Page>
    )
}