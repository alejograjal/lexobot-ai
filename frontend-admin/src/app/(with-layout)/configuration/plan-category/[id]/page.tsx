"use client"

import { DeletePlanCategory } from "./DeletePlanCategory"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useParams } from "next/navigation"
import { Page } from "@/components/Shared/Page"
import { PlanCategory } from "../components/PlanCategorySchema"
import { formatErrorMessage } from "@/lib/utils"
import { UseSnackbar } from "@/stores/UseSnackbar"
import { PageHeader } from "@/components/Shared/PageHeader"
import { UseMutationCallbacks } from "@/hooks/UseMutationCallbacks"
import { UsePutPlanCategory } from "@/hooks/api/lexobot-ai/planCategory/UsePutPlanCategory"
import { UseGetPlanCategoryById } from "@/hooks/api/lexobot-ai/planCategory/UseGetPlanCategoryById"
import { PlanCategoryForm } from "@/app/(with-layout)/configuration/plan-category/components/PlanCategoryForm"
import { CircularLoadingProgress } from "@/components/Shared/CircularLoadingProgress"

export default function UpdatePlanCategoryPage() {
    const router = useRouter()
    const params = useParams()
    const setSnackbarMessage = UseSnackbar((state) => state.setMessage)

    const planCategoryIdRaw = params?.id

    useEffect(() => {
        if (!planCategoryIdRaw || isNaN(Number(planCategoryIdRaw))) {
            router.replace('/configuration/plan-category')
        }
    }, [planCategoryIdRaw, router])

    const planCategoryId = planCategoryIdRaw && !isNaN(Number(planCategoryIdRaw)) ? String(planCategoryIdRaw) : undefined

    const [loading, setLoading] = useState(false)
    const closeLoading = () => setLoading(false)

    const { data, isLoading, isError, error: errorAPI } = UseGetPlanCategoryById(planCategoryId)

    const { mutate: putPlanCategory } = UsePutPlanCategory({
        planCategoryId: Number(planCategoryId),
        ...UseMutationCallbacks('Categoría de plan actualizada correctamente', '/configuration/plan-category', closeLoading)
    })

    useEffect(() => {
        if (isError) {
            const { error } = errorAPI.data
            setSnackbarMessage(formatErrorMessage(error), 'error')
            router.replace('/configuration/plan-category')
        }
    }, [isError, errorAPI, router, setSnackbarMessage])

    const handleSubmit = (data: PlanCategory) => {
        setLoading(true)
        putPlanCategory({ ...data })
    }

    return (
        <Page
            header={
                <PageHeader
                    title={`Editar usuario ${data?.name}`}
                    subtitle="Actualice los campos que desee"
                    actionButton={<DeletePlanCategory planCategoryId={Number(planCategoryId)} planCategoryName={`${data?.name}`} />}
                />
            }

        >
            {isLoading ? (
                <CircularLoadingProgress />
            ) : (
                <PlanCategoryForm
                    defaultValues={data ?? undefined}
                    onSubmit={handleSubmit}
                    onloading={loading}
                />
            )}

        </Page>
    )
}
