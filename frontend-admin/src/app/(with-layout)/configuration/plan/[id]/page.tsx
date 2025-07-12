"use client"

import { DeletePlan } from "./DeletePlan"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useParams } from "next/navigation"
import { Page } from "@/components/Shared/Page"
import { Plan } from "../components/PlanSchema"
import { formatErrorMessage } from "@/lib/utils"
import { UseSnackbar } from "@/stores/UseSnackbar"
import { PageHeader } from "@/components/Shared/PageHeader"
import { UseMutationCallbacks } from "@/hooks/UseMutationCallbacks"
import { UsePutPlan } from "@/hooks/api/lexobot-ai/plan/UsePutPlan"
import { UseGetPlanById } from "@/hooks/api/lexobot-ai/plan/UseGetPlanById"
import { PlanForm } from "@/app/(with-layout)/configuration/plan/components/PlanForm"
import { CircularLoadingProgress } from "@/components/Shared/CircularLoadingProgress"

export default function UpdatePlanPage() {
    const router = useRouter()
    const params = useParams()
    const setSnackbarMessage = UseSnackbar((state) => state.setMessage)

    const planIdRaw = params?.id

    useEffect(() => {
        if (!planIdRaw || isNaN(Number(planIdRaw))) {
            router.replace('/configuration/plan')
        }
    }, [planIdRaw, router])

    const planId = planIdRaw && !isNaN(Number(planIdRaw)) ? String(planIdRaw) : undefined

    const [loading, setLoading] = useState(false)
    const closeLoading = () => setLoading(false)

    const { data, isLoading, isError, error: errorAPI } = UseGetPlanById(planId)

    const { mutate: putPlan } = UsePutPlan({
        planId: Number(planId),
        ...UseMutationCallbacks('Plan actualizado correctamente', '/configuration/plan', closeLoading)
    })

    useEffect(() => {
        if (isError) {
            const { error } = errorAPI.data
            setSnackbarMessage(formatErrorMessage(error), 'error')
            router.replace('/configuration/plan')
        }
    }, [isError, errorAPI, router, setSnackbarMessage])

    const handleSubmit = async (data: Plan) => {
        setLoading(true)
        await putPlan({ ...data })
    }

    return (
        <Page
            header={
                <PageHeader
                    title={`Editar plan ${data?.name}`}
                    subtitle="Actualice los campos que desee"
                    actionButton={<DeletePlan planId={Number(planId)} planName={`${data?.name}`} />}
                />
            }

        >
            {isLoading ? (
                <CircularLoadingProgress />
            ) : (
                <PlanForm
                    defaultValues={data ?? undefined}
                    onSubmit={handleSubmit}
                    onloading={loading}
                />
            )}

        </Page>
    )
}
