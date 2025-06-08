
"use client"

import { useRouter } from 'next/navigation';
import { ErrorDetail } from '@/types/lexobot-ai';
import { formatErrorMessage } from '@/lib/utils';
import { UseSnackbar } from '@stores/UseSnackbar';

export const UseMutationCallbacks = (successMessage: string, redirectTo: string, onSettledCallback?: () => void) => {
    const router = useRouter();
    const setSnackbarMessage = UseSnackbar((state) => state.setMessage);

    return {
        onSuccess: () => {
            setSnackbarMessage(successMessage, 'success');
            router.replace(redirectTo);
        },
        onError: (data: ErrorDetail) => {
            setSnackbarMessage(formatErrorMessage(data), 'error');
        },
        onSettled: () => {
            onSettledCallback?.();
        },
    };
};