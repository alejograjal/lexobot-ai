/* eslint-disable @typescript-eslint/no-unused-vars */
import type { NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
    const { url, body } = await request.json()

    if (!url) {
        return new Response(JSON.stringify({ error: 'Missing url' }), { status: 400 })
    }

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
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
