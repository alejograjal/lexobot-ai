"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { columns } from "../assign/TableColumns";
import { DataTable } from "@/components/ui/data-table";
import { SidePanel } from "@/components/Shared/SidePanel";
import { UseMutationCallbacks } from "@/hooks/UseMutationCallbacks";
import { UsePostBulkTenantUsers } from "@/hooks/api/lexobot-ai/tenant/UsePostBulkTenantUsers";
import { UseGetTenantUsersAvailableToAssign } from "@/hooks/api/lexobot-ai/tenant/UseGetTenantUsersAvailableToAssign";

interface AddExistingTenantsUsersProps {
    tenantId: number
}

export default function AddExistingTenantsUsers({ tenantId }: AddExistingTenantsUsersProps) {
    const [loading, setLoading] = useState(false);
    const [selectedIds, setSelectedIds] = useState<number[]>([])
    const [rowSelection, setRowSelection] = useState({})

    const closeLoading = () => {
        setLoading(false)
    }

    const { data: tenantUsers, isLoading: isLoadingTenantUsers, isError: isErrorTenantUsers } = UseGetTenantUsersAvailableToAssign(String(tenantId))

    const { mutate: postBulk } = UsePostBulkTenantUsers({ tenantId: Number(tenantId), ...UseMutationCallbacks('Usuarios asignados correctamente', `/tenant/${tenantId}/user`, closeLoading) })

    const handleAssign = () => {
        setLoading(true);
        postBulk({
            assign: true,
            user_ids: selectedIds
        })
    }

    return (
        <SidePanel
            title="Agregar existente"
            description="Seleccione los usuarios que desea agregar"
            onSubmit={handleAssign}
            submitText="Guardar"
            isSaving={loading || selectedIds.length === 0}
            trigger={
                <Button variant="default" className="bg-primary text-white hover:bg-primary/90 w-full sm:w-[150px]" onClick={() => {
                    setSelectedIds([]);
                    setRowSelection({});
                }}>
                    Agregar existente
                </Button>
            }
        >
            <div className="container max-w-lg py-2 mx-auto">
                <DataTable columns={columns} data={tenantUsers ?? []} loading={isLoadingTenantUsers} error={isErrorTenantUsers} selectable onSelectionChange={setSelectedIds} rowSelection={rowSelection} onRowSelectionChange={setRowSelection} />
            </div>
        </SidePanel>
    )
}