import axios from 'axios'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL
const IS_LOCAL = process.env.NODE_ENV === 'development';

export async function sendQuestion(question: string, tenant_id: string, sessionId: string): Promise<{ answer: string }> {
    const url = `${API_BASE_URL}/ask/${tenant_id}`

    const headers = {
        'X-Session-Id': sessionId,
        'X-Tenant-Id': tenant_id,
        'Content-Type': 'application/json'
    };

    if (!IS_LOCAL) {
        const res = await axios.post(url, { question }, { headers });
        return res.data;
    }

    const res = await axios.post('/api/proxy', {
        url,
        body: { question },
        headers
    });

    return res.data;
}
