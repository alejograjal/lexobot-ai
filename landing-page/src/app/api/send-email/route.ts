import { NextResponse } from 'next/server'

export async function POST(request: Request) {
    try {
        const { templateId, params } = await request.json()
        const apiKey = process.env.NEXT_PUBLIC_BREVO_API_KEY
        const emailToSend = process.env.NEXT_PUBLIC_EMAIL_TO_SEND
        const nameToSend = process.env.NEXT_PUBLIC_NAME_TO_SEND

        const res = await fetch('https://api.brevo.com/v3/smtp/email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'api-key': apiKey!,
            },
            body: JSON.stringify({
                "to": [{ email: emailToSend!, name: nameToSend! }],
                templateId: Number(templateId),
                params,
                sender: { email: 'no-reply@lexobot-ai.com', name: 'LexoBot-AI' },
            }),
        })

        if (!res.ok) {
            const err = await res.json()
            return NextResponse.json({ error: err }, { status: res.status })
        }

        return NextResponse.json({ message: 'Correo enviado' })
    } catch (error) {
        const errorMessage = typeof error === 'object' && error !== null && 'message' in error
            ? (error as { message: string }).message
            : String(error);
        return NextResponse.json({ error: errorMessage }, { status: 500 })
    }
}
