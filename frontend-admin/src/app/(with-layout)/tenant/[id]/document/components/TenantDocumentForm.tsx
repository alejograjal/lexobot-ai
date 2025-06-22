"use client";

import { Form } from "@/components/ui/form";
import { DefaultValues } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, SubmitHandler } from "react-hook-form";
import { FormActions } from "@/components/Form/FormActions";
import { FormFieldWrapper } from "@/components/Form/FormFieldWrapper";
import { TenantDocument, tenantDocumentSchema } from "./DocumentSchema";
import { FormDocumentUploader } from "@/components/Form/FormDocumentUploader";

interface TenantDocumentFormProps {
    defaultValues?: DefaultValues<TenantDocument>;
    onSubmit: SubmitHandler<TenantDocument>;
    onloading: boolean;
    onEdit?: boolean;
}

export const TenantDocumentForm = ({
    defaultValues,
    onSubmit,
    onloading,
    onEdit = false,
}: TenantDocumentFormProps) => {
    const form = useForm<TenantDocument>({
        resolver: yupResolver(tenantDocumentSchema),
        defaultValues,
    });

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-w-md">
                <FormFieldWrapper name="document_name" label="Nombre del documento" />

                {!onEdit && (
                    <FormDocumentUploader onFileChange={(file) => { if (file) form.setValue("file", file) }} error={form.formState.errors.file?.message} />
                )}

                <FormActions pathCancel="/documentos" isSaving={onloading} onlyCancel={!!onEdit} />

            </form>
        </Form>
    );
};
