
"use client"

import { useRouter } from 'next/navigation';
import { ErrorDetail } from '@/types/lexobot-ai';
import { formatErrorMessage } from '@/lib/utils';
import { UseSnackbar } from '@stores/UseSnackbar';
import { on } from 'events';

export const UseMutationCallbacks = (successMessage: string, redirectTo?: string, onSettledCallback?: () => void) => {
    const router = useRouter();
    const setSnackbarMessage = UseSnackbar((state) => state.setMessage);

    return {
        onSuccess: (data: unknown, _variables: unknown) => {
            setSnackbarMessage(successMessage, 'success');
            if (redirectTo) {
                router.replace(redirectTo);
            }
            onSettledCallback?.();
        },
        onError: (data: ErrorDetail, _variables: unknown) => {
            if (data === undefined) {
                setSnackbarMessage('Se ha producido un error, por favor vuelva a intentarlo', 'error');
                return
            }
            setSnackbarMessage(formatErrorMessage(data), 'error');
        },
        onSettled: (_data: unknown, _error: unknown, _variables: unknown) => {
            onSettledCallback?.();
        },
    };
};