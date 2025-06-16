import PlanTable from "./Table";
import { Page } from "@/components/Shared/Page";
import { PageHeader } from "@/components/Shared/PageHeader";
import NewActionButton from "@/components/Shared/NewActionButton";

export default function Plan() {
    return (
        <Page
            header={
                <PageHeader
                    title="Planes"
                    actionButton={<NewActionButton path="/configuration/plan/new" title="Crear plan" />}
                />
            }
        >
            <PlanTable />
        </Page>
    )
}