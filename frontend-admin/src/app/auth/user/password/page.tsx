import { Suspense } from "react"
import ChangePassword from "@/app/auth/user/password/ChangePassword"
import { CircularLoadingProgress } from "@/components/Shared/CircularLoadingProgress"

export default function ChangePasswordPage() {
    return (
        <Suspense fallback={<CircularLoadingProgress />}>
            <ChangePassword />
        </Suspense>
    )
}