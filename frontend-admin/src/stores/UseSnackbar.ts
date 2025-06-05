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
      toast(message, {
        duration: 4000,
        className:
          severity === "success"
            ? "bg-green-100 text-green-800"
            : severity === "error"
            ? "bg-red-100 text-red-800"
            : severity === "warning"
            ? "bg-yellow-100 text-yellow-800"
            : undefined,
      })
      set({ visible: true, message, severity })
    } else {
      set({ visible: false, message: null })
    }
  },
}))
