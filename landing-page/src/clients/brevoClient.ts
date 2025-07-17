export interface BrevoEmailParams {
    fullName: string
    email: string
    phone: string
    company: string
    description: string
}

export async function sendBrevoEmail(params: BrevoEmailParams) {
    const templateId = process.env.NEXT_PUBLIC_BREVO_TEMPLATE_ID

    await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            templateId: templateId,
            params
        }),
    })
}
