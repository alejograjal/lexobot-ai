import { twMerge } from "tailwind-merge"
import { clsx, type ClassValue } from "clsx"
import { ErrorDetail } from "@/types/lexobot-ai";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatErrorMessage = (error: ErrorDetail): string => {
    if (error.details && error.details.length > 0) {
        return error.details
            .map((d) => d.ctx?.reason || d.msg || 'Unknown validation error')
            .join('\n');
    }

    return error.message;
};