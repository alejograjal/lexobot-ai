import axios from 'axios'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://yourapi.com'

export async function sendQuestion(question: string, tenant_id: string): Promise<{ answer: string }> {
    console.log('Sending question:', question, `${API_BASE_URL}/ask/${tenant_id}`)
    const res = await axios.post(`${API_BASE_URL}/ask/${tenant_id}`, { question })
    console.log('Response:', res.data)
    return res.data
}
