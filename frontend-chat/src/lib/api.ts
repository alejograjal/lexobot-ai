import axios from 'axios'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export async function sendQuestion(question: string, tenant_id: string, sessionId: string): Promise<{ answer: string }> {
    const proxiedUrl = `${API_BASE_URL}/ask/${tenant_id}`

    const res = await axios.post('/api/proxy', {
        url: proxiedUrl,
        body: { question },
        headers: {
            'X-Session-ID': sessionId
        }
    })

    return res.data
}
