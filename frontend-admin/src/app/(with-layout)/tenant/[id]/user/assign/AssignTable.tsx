"use client"

import Link from "next/link";
import { columns } from "./TableColumns";
import { Roles } from "@/types/lexobot-ai";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { DataTable } from "@/components/ui/data-table";
import { ButtonLoading } from "@/components/Button/ButtonLoading";
import { UseMutationCallbacks } from "@/hooks/UseMutationCallbacks";
import { UseGetRoles } from "@/hooks/api/lexobot-ai/role/UseGetRoles";
import { UseGetUsersByRole } from "@/hooks/api/lexobot-ai/user/UseGetUsersByRole";
import { UseGetTenantUsers } from "@/hooks/api/lexobot-ai/tenant/UseGetTenantUsers";
import { UsePutBulkTenantUsers } from "@/hooks/api/lexobot-ai/tenant/UsePutBulkTenantUsers";

export default function AssignTable({ tenantId }: { tenantId: string | undefined }) {
    const [loading, setLoading] = useState(false);
    const [selectedIds, setSelectedIds] = useState<number[]>([])
    const [rowSelection, setRowSelection] = useState({})

    const closeLoading = () => setLoading(false)

    const { data: tenantUsers, isLoading: isLoadingTenantUsers, isError: isErrorTenantUsers } = UseGetTenantUsers(tenantId)

    useEffect(() => {
        if (tenantUsers) {
            const assignedIds = tenantUsers.filter(u => u.assign).map(u => u.id)
            setSelectedIds(assignedIds)

            const selectionObj = Object.fromEntries(assignedIds.map(id => [String(id), true]))
            setRowSelection(selectionObj)
        }
    }, [tenantUsers])

    const { mutate: postBulk } = UsePutBulkTenantUsers({ tenantId: Number(tenantId), ...UseMutationCallbacks('Usuarios asignados correctamente', `/tenant/${tenantId}/user`, closeLoading) })

    const handleAssign = () => {
        postBulk({
            assign: true,
            user_ids: selectedIds
        })
    }

    return (
        <div className="container max-w-lg py-2 mx-auto">
            <DataTable columns={columns} data={tenantUsers ?? []} loading={isLoadingTenantUsers} error={isErrorTenantUsers} selectable onSelectionChange={setSelectedIds} rowSelection={rowSelection} onRowSelectionChange={setRowSelection} />

            <div className="flex flex-col-reverse justify-center gap-2 sm:gap-4 mt-4 sm:flex-row">
                <Link href={`/tenant/${tenantId}/user`}>
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