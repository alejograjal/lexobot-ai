"use client"


import { useEffect, useMemo, useState } from "react"
import { Input } from "@/components/ui/input"
import { ErrorProcess } from "../Shared/ErrorProcess"
import { CircularLoadingProgress } from "../Shared/CircularLoadingProgress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ColumnDef, flexRender, getCoreRowModel, getFilteredRowModel, getSortedRowModel, OnChangeFn, RowSelectionState, SortingState, useReactTable } from "@tanstack/react-table"

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
    loading?: boolean
    error?: boolean
    onRowClick?: (row: TData) => void
    selectable?: boolean
    onSelectionChange?: (ids: number[]) => void
    rowSelection?: Record<string, boolean>
    onRowSelectionChange?: (rowSelection: Record<string, boolean>) => void
}

export function DataTable<TData, TValue>({
    columns,
    data,
    loading,
    error,
    onRowClick,
    selectable,
    onSelectionChange,
    rowSelection,
    onRowSelectionChange
}: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = useState<SortingState>([{ id: "id", desc: true }])
    const [globalFilter, setGlobalFilter] = useState("")

    const normalizedColumns = useMemo(() => {
        return columns.map((col, index) => {
            if (!("id" in col)) {
                const fallbackId =
                    "accessorKey" in col && col.accessorKey
                        ? col.accessorKey.toString()
                        : typeof col.header === "string"
                            ? col.header.toLowerCase().replace(/\s+/g, "_")
                            : `col_${index}`
                return { ...col, id: fallbackId }
            }
            return col
        })
    }, [columns])

    const flattenObject = (obj: any): Record<string, unknown> => {
        const flattened: Record<string, unknown> = {};

        for (const key in obj) {
            if (typeof obj[key] === 'object' && obj[key] !== null) {
                const nested = flattenObject(obj[key]);
                for (const nestedKey in nested) {
                    flattened[`${key}.${nestedKey}`] = nested[nestedKey];
                }
            } else {
                flattened[key] = obj[key];
            }
        }

        return flattened;
    };

    const handleRowSelectionChange: OnChangeFn<RowSelectionState> = (updater) => {
        if (!onRowSelectionChange) return

        if (typeof updater === "function") {
            onRowSelectionChange(updater(rowSelection ?? {}))
        } else {
            onRowSelectionChange(updater)
        }
    }

    const table = useReactTable({
        data,
        columns: normalizedColumns,
        getCoreRowModel: getCoreRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onRowSelectionChange: handleRowSelectionChange,
        getRowId: (row: any) => String(row.id),
        enableRowSelection: selectable,
        globalFilterFn: (row, columnId, filterValue) => {
            const flattenedRow = flattenObject(row.original);
            return Object.values(flattenedRow).some((value) =>
                String(value).toLowerCase().includes(String(filterValue).toLowerCase())
            );
        },
        state: {
            sorting,
            globalFilter,
            rowSelection: rowSelection ?? {},
        },
    })

    useEffect(() => {
        if (!onSelectionChange) return

        const selected = table.getSelectedRowModel().rows.map(row => row.original.id)
        onSelectionChange(selected)
    }, [rowSelection, onSelectionChange, table])

    if (loading) {
        <CircularLoadingProgress />
    }

    if (error) {
        <ErrorProcess />
    }

    return (
        <div>
            <div className="flex items-center py-4">
                <Input
                    placeholder="Buscar en todas las columnas..."
                    value={globalFilter}
                    onChange={(e) => setGlobalFilter(e.target.value)}
                    className="max-w-sm mb-4"
                />
            </div>
            <div className="rounded-md border">
                <Table>
                    <TableHeader className="bg-black">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                    onClick={() => onRowClick?.(row.original)}
                                    className={onRowClick ? "cursor-pointer hover:bg-muted/50" : ""}
                                >
                                    {
                                        row.getVisibleCells().map((cell) => (
                                            <TableCell key={cell.id}>
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </TableCell>
                                        ))
                                    }
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    Sin resultados.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}