import RoleTable from "./Table";
import { Page } from "@/components/Shared/Page";
import { PageHeader } from "@/components/Shared/PageHeader";

export default function Role() {
    return (
        <Page header={<PageHeader title="Roles" />}>
            <RoleTable />
        </Page >
    )
}