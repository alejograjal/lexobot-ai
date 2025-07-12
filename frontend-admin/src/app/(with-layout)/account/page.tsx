import { Page } from "@/components/Shared/Page";
import AccountInformation from "./AccountInformation";
import PasswordChange from "./PasswordChange";
import { PageHeader } from "@/components/Shared/PageHeader";

export default function AccountPage() {
    return (
        <Page
            header={
                <PageHeader
                    title="Información de cuenta"
                />
            }
        >
            <AccountInformation />
            <PasswordChange />
        </Page>
    )
}