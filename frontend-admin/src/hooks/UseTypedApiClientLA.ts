"use client";

import { paths } from "@api/clients/lexobot-ai/api";
import { useTokenStore } from '@/stores/UseTokenStore';
import { createAuthMiddleware } from './middleware/authMiddleware';
import { Fetcher, type TypedFetch } from "openapi-typescript-fetch";
import { arrayWrapperMiddleware } from './middleware/arrayWrapperMiddleware';

const getHeaders = (disableAuth: boolean, token: string): Record<string, string> => disableAuth ? {} : { Authorization: `Bearer ${token}` }

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
    const baseUrl = process.env.NEXT_PUBLIC_API_LEXOBOT_URL;

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
        if (typeof data === 'object') return data as never;
        return extractPathParams(path, data) as never;
    }

    return undefined as never;
};

function extractPathParams<PathT extends string>(path: PathT, data: unknown) {
    const pathParams = path.match(/{([^{}]+)}/g);
    if (!pathParams) return {};
    return pathParams.reduce((acc, param) => {
        const name = param.replace(/[{}]/g, '');
        if (typeof data === 'object' && data !== null && name in data) {
            acc[name] = (data as Record<string, unknown>)[name];
        }
        return acc;
    }, {} as Record<string, unknown>);
}