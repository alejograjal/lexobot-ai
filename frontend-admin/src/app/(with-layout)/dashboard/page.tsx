"use client"

import { format } from "date-fns"
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import { ChartLineLabel } from "@/components/charts/ChartLineLabel";
import { useTenantSelectionStore } from "@/stores/UseTenantSelectionStore";
import { UseGetTenantMetrics } from "@/hooks/api/lexobot-ai/tenant/UseGetTenantMetrics";
import { UseSnackbar } from "@/stores/UseSnackbar";
import { CardResumen } from "./CardResumen";
import { CardTopQuestions } from "./CardTopQuestions";
import { UseGetTenantDocumentCount } from "@/hooks/api/lexobot-ai/tenantDocument/UseGetTenantDocumentCount";



const mockData = [
  { month: "January", desktop: 186 },
  { month: "February", desktop: 305 },
  { month: "March", desktop: 237 },
  { month: "April", desktop: 73 },
  { month: "May", desktop: 209 },
  { month: "June", desktop: 214 },
]

export default function Page() {
  const [startDate, setStartDate] = useState<Date | undefined>(new Date())
  const [endDate, setEndDate] = useState<Date | undefined>(new Date())
  const [filterTenantId, setFilterTenantId] = useState<string | null>(null)
  const [filterStartDateStr, setFilterStartDateStr] = useState<string | undefined>(undefined)
  const [filterEndDateStr, setFilterEndDateStr] = useState<string | undefined>(undefined)

  const { tenantId } = useTenantSelectionStore()
  const setSnackbarMessage = UseSnackbar((state) => state.setMessage);

  const { data, isLoading, isError, isFetched } = UseGetTenantMetrics(filterTenantId, filterStartDateStr, filterEndDateStr, Boolean(filterTenantId && filterStartDateStr && filterEndDateStr))
  const { data: totalDocuments, isError: isErrorDocuments, isLoading: isLoadingDocuments } = UseGetTenantDocumentCount(filterTenantId, Boolean(filterTenantId))

  const handleConsultar = () => {
    if (tenantId === null) {
      setSnackbarMessage("Debes seleccionar un tenant", "error")
      return;
    }

    if (!startDate || !endDate) {
      setSnackbarMessage("Debes seleccionar un rango de fechas", "error")
      return;
    }

    setFilterTenantId(String(tenantId))
    setFilterStartDateStr(format(startDate, "yyyy-MM-dd"))
    setFilterEndDateStr(format(endDate, "yyyy-MM-dd"))
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="flex gap-4 flex-wrap items-end">
        <DatePicker label="Fecha inicio" date={startDate} setDate={setStartDate} />
        <DatePicker label="Fecha fin" date={endDate} setDate={setEndDate} maxDate={new Date()} />
        <Button onClick={handleConsultar}>Consultar</Button>
      </div>

      <div className="grid auto-rows-min gap-4 md:grid-cols-4">
        <CardResumen
          title="Total de preguntas"
          total={data?.total ?? 0}
        />

        <div className="md:col-span-2">
          <CardTopQuestions topQuestions={data?.top_questions ?? []} />
        </div>

        <CardResumen
          title="Total de documentos"
          total={totalDocuments?.count ?? 0}
        />
      </div>

      <div className="grid grid-cols-1">
        <ChartLineLabel
          data={data?.by_day ?? []}
          title="Preguntas por día"
          description="Cantidad de preguntas hechas durante el día"
          dataKeyXAxis="date"
          dataKeyYAxis="count"
        />
      </div>
    </div>
  )
}
