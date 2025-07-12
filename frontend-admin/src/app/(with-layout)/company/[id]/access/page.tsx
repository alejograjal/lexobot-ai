"use client";

import { useEffect, useState } from "react";
import { formatErrorMessage } from "@/lib/utils";
import { UseSnackbar } from "@/stores/UseSnackbar";
import { useParams, useRouter } from "next/navigation";
import { CompanyAccessForm } from "./components/CompanyAccessForm";
import { UseMutationCallbacks } from "@/hooks/UseMutationCallbacks";
import { CircularLoadingProgress } from "@/components/Shared/CircularLoadingProgress";
import { CompanyAccess as CompanyAccessSchema, initialValues } from "./components/CompanyAccessSchema";
import { UsePutCompanyAccess } from "@/hooks/api/lexobot-ai/companyAccess/UsePutCompanyAccess";
import { UsePostCompanyAccess } from "@/hooks/api/lexobot-ai/companyAccess/UsePostCompanyAccess";
import { UseGetCompanyAccesses } from "@/hooks/api/lexobot-ai/companyAccess/UseGetCompanyAccesses";
import { init } from "next/dist/compiled/webpack/webpack";

function mapCompanyAccessToDto(data: CompanyAccessSchema) {
    return {
        ...data,
        plan_acquisition_date: data.plan_acquisition_date.toISOString(),
        plan_expiration_date: data.plan_expiration_date.toISOString(),
    }
}

function mapCompanyAccessToForm(data: any) {
    return {
        ...data,
        plan_acquisition_date: data.plan_acquisition_date ? new Date(data.plan_acquisition_date) : undefined,
        plan_expiration_date: data.plan_expiration_date ? new Date(data.plan_expiration_date) : undefined,
    }
}

export default function CompanyAccess() {
    const router = useRouter()
    const params = useParams()
    const setSnackbarMessage = UseSnackbar((state) => state.setMessage)

    const companyIdRaw = params?.id

    useEffect(() => {
        if (!companyIdRaw || isNaN(Number(companyIdRaw))) {
            router.replace('/company')
        }
    }, [companyIdRaw, router])

    const companyId = companyIdRaw && !isNaN(Number(companyIdRaw)) ? String(companyIdRaw) : undefined

    const [loading, setLoading] = useState(false)
    const closeLoading = () => setLoading(false)

    const { data: companyAccess, isLoading, isError, error: errorAPI } = UseGetCompanyAccesses(companyId)

    const existsAccess = companyAccess && companyAccess.length > 0

    const { mutate: postCompanyAccess } = UsePostCompanyAccess({
        companyId: Number(companyId),
        ...UseMutationCallbacks('Acceso de compañía creado correctamente', '/company', closeLoading)
    })

    const { mutate: putCompanyAccess } = UsePutCompanyAccess({
        companyId: Number(companyId),
        companyAccessId: Number(existsAccess ? companyAccess![0].id : 0),
        ...UseMutationCallbacks('Acceso de compañía actualizado correctamente', '/company', closeLoading)
    })

    const handleSubmit = async (data: CompanyAccessSchema) => {

        setLoading(true)
        const payload = mapCompanyAccessToDto(data)

        if (!existsAccess) {
            postCompanyAccess(payload)
            return;
        }

        await putCompanyAccess(payload)
    }

    useEffect(() => {
        if (isError) {
            const { error } = errorAPI.data
            setSnackbarMessage(formatErrorMessage(error), 'error')
            router.replace('/company')
        }
    }, [isError, errorAPI, router, setSnackbarMessage])

    return (
        <>
            <div className="flex items-center my-8 max-w-md">
                <div className="flex-grow border-t border-gray-300" />
                <span className="mx-4 text-gray-500 text-sm">Accesos</span>
                <div className="flex-grow border-t border-gray-300" />
            </div>

            {isLoading ? (
                <CircularLoadingProgress />
            ) : (
                <CompanyAccessForm
                    defaultValues={existsAccess ? mapCompanyAccessToForm(companyAccess[0]) : initialValues}
                    onSubmit={handleSubmit}
                    onloading={loading}
                />
            )}
        </>
    )
}