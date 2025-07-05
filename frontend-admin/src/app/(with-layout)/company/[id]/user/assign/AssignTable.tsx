"use client"

import Link from "next/link";
import { columns } from "./TableColumns";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { ButtonLoading } from "@/components/Button/ButtonLoading";
import { UseMutationCallbacks } from "@/hooks/UseMutationCallbacks";
import { UseGetCompanyUsers } from "@/hooks/api/lexobot-ai/company/UseGetCompanyUsers";
import { UsePutBulkCompanyUsers } from "@/hooks/api/lexobot-ai/company/UsePutBulkCompanyUsers";

export default function AssignTable({ companyId }: { companyId: string | undefined }) {
    const [loading, setLoading] = useState(false);
    const [selectedIds, setSelectedIds] = useState<number[]>([])
    const [rowSelection, setRowSelection] = useState({})

    const closeLoading = () => setLoading(false)

    const { data: companyUsers, isLoading: isLoadingCompanyUsers, isError: isErrorCompanyUsers } = UseGetCompanyUsers(companyId)

    useEffect(() => {
        if (companyUsers) {
            const assignedIds = companyUsers.filter(u => u.assign).map(u => u.id)
            setSelectedIds(assignedIds)

            const selectionObj = Object.fromEntries(assignedIds.map(id => [String(id), true]))
            setRowSelection(selectionObj)
        }
    }, [companyUsers])

    const { mutate: postBulk } = UsePutBulkCompanyUsers({ companyId: Number(companyId), ...UseMutationCallbacks('Usuarios asignados correctamente', `/company/${companyId}/user`, closeLoading) })

    const handleAssign = () => {
        postBulk({
            assign: true,
            user_ids: selectedIds
        })
    }

    return (
        <div className="container max-w-lg py-2 mx-auto">
            <DataTable columns={columns} data={companyUsers ?? []} loading={isLoadingCompanyUsers} error={isErrorCompanyUsers} selectable onSelectionChange={setSelectedIds} rowSelection={rowSelection} onRowSelectionChange={setRowSelection} />

            <div className="flex justify-center gap-4 mt-4">
                <Link href={`/company/${companyId}/user`}>
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