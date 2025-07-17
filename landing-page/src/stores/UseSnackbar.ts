import { toast } from "sonner"
import { create } from "zustand"

type Severity = "success" | "error" | "warning" | "info" | undefined

interface SnackbarState {
    visible: boolean
    message: string | null
    severity?: Severity
    setMessage: (
        message: string | null,
        severity?: Severity,
    ) => void
}

export const UseSnackbar = create<SnackbarState>((set) => ({
    visible: false,
    message: null,
    severity: undefined,
    setMessage: (message, severity = undefined) => {
        if (message !== null) {
            switch (severity) {
                case "success":
                    toast.success(message, { duration: 4000, position: "top-center" })
                    break
                case "error":
                    toast.error(message, { duration: 4000, position: "top-center" })
                    break
                case "warning":
                    toast.warning(message, { duration: 4000, position: "top-center" })
                    break
                case "info":
                    toast.info(message, { duration: 4000, position: "top-center" })
                    break
                default:
                    toast(message, { duration: 4000, position: "top-center" })
                    break
            }
            set({ visible: true, message, severity })
        } else {
            set({ visible: false, message: null })
        }
    },
}))
