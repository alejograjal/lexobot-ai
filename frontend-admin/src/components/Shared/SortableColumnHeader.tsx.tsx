'use client'

import { ArrowUpDown } from "lucide-react"
import { Column } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"

interface SortableColumnHeaderProps<TData, TValue> {
    column: Column<TData, TValue>
    title: string
}

export const SortableColumnHeader = <TData, TValue>({
    column,
    title
}: SortableColumnHeaderProps<TData, TValue>) => {
    return (
        <Button
            variant="ghost"
            onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
            }
            className="w-full flex items-center justify-between text-white"
        >
            {title}
            <ArrowUpDown className="ml-2 h-4 w-4 justify-end" />
        </Button>
    )
}
