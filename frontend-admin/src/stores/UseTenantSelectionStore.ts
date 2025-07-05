import { create } from "zustand"
import { persist } from "zustand/middleware"

interface TenantSelectionStore {
    tenantId: number | null
    setTenantId: (tenantId: number) => void
    clearTenantId: () => void
    getTenantId: () => number | null
}

export const useTenantSelectionStore = create(
    persist<TenantSelectionStore>(
        (set, get) => ({
            tenantId: null,
            setTenantId: (tenantId) => set({ tenantId }),
            clearTenantId: () => set({ tenantId: null }),
            getTenantId: () => get().tenantId,
        }),
        {
            name: "tenant-selection", // nombre de la key en localStorage
        }
    )
)
