import { create } from 'zustand';

interface TenantSelectionStore {
    tenantId: number | null;
    setTenantId: (tenantId: number) => void;
    clearTenantId: () => void;
    getTenantId: () => number | null;
}

export const useTenantSelectionStore = create<TenantSelectionStore>((set, get) => ({
    tenantId: null,
    setTenantId: (tenantId) => set({ tenantId }),
    clearTenantId: () => set({ tenantId: null }),
    getTenantId: () => get().tenantId,
}));
