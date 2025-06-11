import { twMerge } from "tailwind-merge"
import { clsx, type ClassValue } from "clsx"
import { ErrorDetail } from "@/types/lexobot-ai";

export const telephoneMaskRegex = /^\d{4}-\d{4}$/;

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

export const isPresent = <T>(t: T): t is NonNullable<T> => {
    return t !== null && t !== undefined;
};

export const getInitials = (fullName?: string) => {
    if (!fullName) return "US"

    const names = fullName.trim().split(" ")
    const initials = names
        .slice(0, 2)
        .map((n) => n.charAt(0).toUpperCase())
        .join("")

    return initials || "US"
}

export const removePhoneMask = (phone: string): number => {
    const unmaskedPhone = phone.replace(/[^\d]/g, '');
    return parseInt(unmaskedPhone, 10);
};

export const applyPhoneMask = (phone: string): string => {
    const numericPhone = phone.replace(/\D/g, '');
    if (numericPhone.length !== 8) {
        return phone;
    }
    return `${numericPhone.slice(0, 4)}-${numericPhone.slice(4)}`;
};

export const formatCurrency = (
    value: number,
    options: {
        thousandSeparator?: string;
        decimalSeparator?: string;
        prefix?: string;
    } = {}
): string => {
    const {
        thousandSeparator = ',',
        decimalSeparator = '.',
        prefix = '$'
    } = options;

    const parts = Math.abs(value).toFixed(2).split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, thousandSeparator);

    const formattedValue = `${prefix}${parts.join(decimalSeparator)}`;
    return value < 0 ? `-${formattedValue}` : formattedValue;
};