"use client";

import Cookies from 'js-cookie';
import { paths } from "@api/clients/lexobot-ai/api";
import { useTokenStore } from '@/stores/UseTokenStore';
import { createAuthMiddleware } from './middleware/authMiddleware';
import { Fetcher, type TypedFetch } from "openapi-typescript-fetch";
import { arrayWrapperMiddleware } from './middleware/arrayWrapperMiddleware';

const getHeaders = (disableAuth: boolean, token: string): Record<string, string> => {
    if (disableAuth) {
        return {}
    }

    return {
        Authorization: `Bearer ${token}`
    }
}


export const UseTypedApiClientLA = <
    PathT extends keyof paths,
    MethodT extends keyof paths[PathT],
>({
    path,
    method,
    disableAuth = false
}: {
    path: PathT
    method: MethodT
    disableAuth?: boolean
}): TypedFetch<paths[PathT][MethodT]> => {
    const { getAccessToken } = useTokenStore();
    const fetcher = Fetcher.for<paths>();
    const baseUrl = process.env.NODE_ENV === 'development' ? '' : process.env.NEXT_PUBLIC_API_WEB_STACK_BASE_URL;

    fetcher.configure({
        baseUrl,
        init: {
            credentials: 'include',
            headers: getHeaders(disableAuth, getAccessToken() ?? ''),
        },
        use: [arrayWrapperMiddleware, createAuthMiddleware(baseUrl!)]
    });

    return fetcher.path(path).method(method).create({}) as TypedFetch<paths[PathT][MethodT]>;
}

export const castRequestBody = <
    PathT extends keyof paths,
    MethodT extends keyof paths[PathT]
>(
    data: unknown,
    path: PathT,
    method: MethodT
): paths[PathT][MethodT] extends { requestBody: { content: { 'application/json': infer R } } } ? R | undefined : never => {
    if (method === 'post' || method === 'put' || method === 'patch') {
        return data as paths[PathT][MethodT] extends { requestBody: { content: { 'application/json': infer R } } } ? R : never;
    }

    if (method === 'get' || method === 'delete') {
        if (data && typeof data === 'object') {
            return data as never;
        }

        const pathParams = path.match(/{([^{}]+)}/g);
        if (pathParams) {
            const pathObj = pathParams.reduce((acc, param) => {
                const paramName = param.replace(/[{}]/g, '');
                if (typeof data === 'object' && data !== null && paramName in (data as Record<string, unknown>)) {
                    acc[paramName] = (data as Record<string, unknown>)[paramName];
                }
                return acc;
            }, {} as { [key: string]: unknown });

            return pathObj as never;
        }
    }

    return undefined as never;
};