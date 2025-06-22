import { Button } from "@/components/ui/button";
import { ButtonLoading } from "../Button/ButonLoading";
import Link from "next/link";

interface FormActionsProps {
    pathCancel: string;
    isSaving: boolean;
    onlyCancel?: boolean;
}

export function FormActions({ pathCancel, isSaving, onlyCancel = false }: FormActionsProps) {
    return (
        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end sm:gap-4 pt-4">
            <Link href={pathCancel}>
                <Button
                    type="button"
                    variant="outline"
                    className="w-full sm:w-auto"
                    disabled={isSaving}
                >
                    Cancelar
                </Button>
            </Link>

            {
                !onlyCancel &&
                <ButtonLoading type="submit" loading={isSaving} className="w-full sm:w-auto">
                    Guardar
                </ButtonLoading>
            }


        </div>
    );
}
