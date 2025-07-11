import CompanyTable from "./Table";
import { Page } from "@/components/Shared/Page";
import { PageHeader } from "@/components/Shared/PageHeader";
import NewActionButton from "@/components/Shared/NewActionButton";

export default function PlanCategory() {
    return (
        <Page
            header={
                <PageHeader
                    title="Categorias de planes"
                    actionButton={<NewActionButton path="/configuration/plan-category/new" title="Crear categoría de plan" className="sm:w-auto w-full" />}
                />
            }
        >
            <CompanyTable />
        </Page>
    )
}