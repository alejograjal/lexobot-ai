import Link from "next/link";
import { columns } from "./TableColumns";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useParams, useRouter } from "next/navigation";
import { DataTable } from "@/components/ui/data-table";
import { ButtonLoading } from "@/components/Button/ButtonLoading";
import { UseMutationCallbacks } from "@/hooks/UseMutationCallbacks";
import { UseGetTenants } from "@/hooks/api/lexobot-ai/tenant/UseGetTenants";
import { UseGetCompanyTenants } from "@/hooks/api/lexobot-ai/companyTenant/UseGetCompanyTenants";
import { UsePutBulkCompanyTenant } from "@/hooks/api/lexobot-ai/companyTenant/UsePutBulkCompanyTenants";

export default function AssignTable() {
    const router = useRouter()
    const params = useParams()
    const companyIdRaw = params?.id
    const [loading, setLoading] = useState(false);
    const [selectedIds, setSelectedIds] = useState<number[]>([])
    const [rowSelection, setRowSelection] = useState({})

    const closeLoading = () => setLoading(false)

    useEffect(() => {
        if (!companyIdRaw || isNaN(Number(companyIdRaw))) {
            router.replace('/company')
        }
    }, [companyIdRaw, router])

    const companyId = companyIdRaw && !isNaN(Number(companyIdRaw)) ? String(companyIdRaw) : undefined

    const { data: availableTenants, isLoading: isLoadingTenants, isError: isErrorTenants } = UseGetTenants()
    const { data: companyTenants, isLoading: isLoadingCompanyTenants, isError: isErrorCompanyTenants } = UseGetCompanyTenants(companyId)

    useEffect(() => {
        if (companyTenants) {
            const ids = companyTenants.map(tenant => tenant.tenant_id)
            setSelectedIds(ids)

            const selectionObj = Object.fromEntries(ids.map(id => [String(id), true]))
            setRowSelection(selectionObj)
        }
    }, [companyTenants])

    const { mutate: postBulk } = UsePutBulkCompanyTenant(UseMutationCallbacks('Tenants gestionados correctamente', `/company/${companyId}/tenants`, closeLoading))

    const handleAssign = async () => {
        await postBulk({
            company_id: parseInt(companyId!),
            tenant_ids: selectedIds
        })
    }

    return (
        <div className="container max-w-lg py-2 mx-auto">
            <DataTable columns={columns} data={availableTenants ?? []} loading={isLoadingTenants || isLoadingCompanyTenants} error={isErrorTenants || isErrorCompanyTenants} selectable onSelectionChange={setSelectedIds} rowSelection={rowSelection} onRowSelectionChange={setRowSelection} />

            <div className="flex flex-col justify-center gap-4 mt-4 sm:flex-row">
                <Link href={`/company/${companyId}/tenants`}>
                    <Button
                        type="button"
                        variant="outline"
                        className="w-full sm:w-auto"
                        disabled={loading}
                    >
                        Cancelar
                    </Button>
                </Link>
                <ButtonLoading onClick={handleAssign} loading={loading} className="w-full sm:w-auto">
                    Guardar
                </ButtonLoading>
            </div>
        </div>
    )
}