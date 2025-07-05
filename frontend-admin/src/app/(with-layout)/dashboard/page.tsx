"use client"

import { useState } from "react";
import { CardResume } from "./CardResumen";
import { PeriodType } from "@/types/lexobot-ai";
import { CardTopQuestions } from "./CardTopQuestions";
import { PeriodToggleGroup } from "./PeriodToggleGroup";
import { ChartLineLabel } from "@/components/charts/ChartLineLabel";
import { useTenantSelectionStore } from "@/stores/UseTenantSelectionStore";
import { UseGetTenantMetricsOverall } from "@/hooks/api/lexobot-ai/tenant/UseGetTenantMetricsOverall";
import { UseGetTenantDocumentCount } from "@/hooks/api/lexobot-ai/tenantDocument/UseGetTenantDocumentCount";
import { UseGetTenantMetricsByPeriod } from "@/hooks/api/lexobot-ai/tenant/UseGetTenantMetricsByPeriod";

export default function Page() {
  const [period, setPeriod] = useState<PeriodType>('day')
  const { tenantId } = useTenantSelectionStore()

  const { data: dataOverall, isLoading: isLoadingOverall, isError: isErrorOverall } = UseGetTenantMetricsOverall(tenantId)
  const { data: dataByPeriod, isLoading: isLoadingByPeriod, isError: isErrorByPeriod } = UseGetTenantMetricsByPeriod(tenantId, period)
  const { data: totalDocuments, isLoading: isLoadingDocuments, isError: isErrorDocuments } = UseGetTenantDocumentCount(tenantId)

  return (
    <div className="flex flex-1 flex-col gap-4 md:p-4 pt-0">

      <div className="grid auto-rows-min gap-4 md:grid-cols-4">
        <CardResume title="Total de preguntas" total={dataOverall?.total ?? 0} isError={isErrorOverall} isLoading={isLoadingOverall} />

        <div className="md:col-span-2">
          <CardTopQuestions topQuestions={dataOverall?.top_questions ?? []} isError={isErrorOverall} isLoading={isLoadingOverall} />
        </div>

        <CardResume title="Total de documentos" total={totalDocuments?.count ?? 0} isError={isErrorDocuments} isLoading={isLoadingDocuments} />
      </div>

      <div className="grid grid-cols-1">
        <ChartLineLabel
          data={dataByPeriod ?? []}
          title="Preguntas por día"
          description="Cantidad de preguntas hechas durante el día"
          dataKeyXAxis="date"
          dataKeyYAxis="count"
          toggleGroup={
            <PeriodToggleGroup period={period} setPeriod={setPeriod} />
          }
          isError={isErrorByPeriod}
          isLoading={isLoadingByPeriod}
        />
      </div>
    </div>
  )
}
