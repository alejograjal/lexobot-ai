'use client'

export const ErrorProcess = ({ message }: { message?: string }) => {
    return (
        <div className="flex items-center justify-start text-center">
            <p className="text-sm text-destructive">
                {message || 'Ha ocurrido un error al momento de consultar la información'}
            </p>
        </div>
    )
}