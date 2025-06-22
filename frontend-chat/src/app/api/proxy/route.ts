/* eslint-disable @typescript-eslint/no-unused-vars */
import type { NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
    const { url, body, headers } = await request.json()

    if (!url) {
        return new Response(JSON.stringify({ error: 'Missing url' }), { status: 400 })
    }

    try {
        const forwardedHeaders = new Headers()
        forwardedHeaders.set('Content-Type', 'application/json')

        for (const [key, value] of Object.entries(headers ?? {})) {
            if (typeof value === 'string') {
                forwardedHeaders.set(key.toLowerCase(), value)
            }
        }

        const response = await fetch(url, {
            method: 'POST',
            headers: forwardedHeaders,
            body: JSON.stringify(body)
        })

        const data = await response.json()

        return new Response(JSON.stringify(data), {
            status: response.status,
            headers: { 'Content-Type': 'application/json' }
        })
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Fetch failed' }), { status: 500 })
    }
}
