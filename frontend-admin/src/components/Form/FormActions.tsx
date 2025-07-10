import { Button } from "@/components/ui/button";
import { ButtonLoading } from "../Button/ButtonLoading";
import Link from "next/link";

interface FormActionsProps {
    pathCancel: string;
    isSaving: boolean;
    onlyCancel?: boolean;
    className?: string;
}

export function FormActions({ pathCancel, isSaving, onlyCancel = false, className }: FormActionsProps) {
    return (
        <div className={`flex flex-col-reverse gap-2 sm:flex-row sm:justify-end sm:gap-4 pt-4 ${className}`}>
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
