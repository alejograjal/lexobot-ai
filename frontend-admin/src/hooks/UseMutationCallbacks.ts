
import { ErrorDetail } from '@/types/lexobot-ai';
import { formatErrorMessage } from '@/lib/utils';
import { UseSnackbar } from '@stores/UseSnackbar';

export const UseMutationCallbacks = (successMessage: string, onSettledCallback?: () => void) => {
    const setSnackbarMessage = UseSnackbar((state) => state.setMessage);

    return {
        onSuccess: () => {
            setSnackbarMessage(successMessage);
        },
        onError: (data: ErrorDetail) => {
            setSnackbarMessage(formatErrorMessage(data), 'error');
        },
        onSettled: () => {
            onSettledCallback?.();
        },
    };
};