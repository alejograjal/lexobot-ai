import { Middleware } from "openapi-typescript-fetch";

export const arrayWrapperMiddleware: Middleware = async (url, init, next) => {
    if (init?.body) {
        const body = JSON.parse(init.body as string);
        const keys = Object.keys(body);
        if (keys.length === 1 && Array.isArray(body[String(keys[0])])) {
            init.body = JSON.stringify(body[String(keys[0])]);
        }
    }
    return next(url, init);
};