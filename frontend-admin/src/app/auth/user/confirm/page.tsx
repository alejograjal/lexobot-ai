import { Suspense } from "react"
import ConfirmAccount from "./ConfirmAccount";
import { CircularLoadingProgress } from "@/components/Shared/CircularLoadingProgress"

export default function ConfirmAccountPage() {
    return (
        <Suspense fallback={<CircularLoadingProgress />}>
            <ConfirmAccount />
        </Suspense>
    )
}
