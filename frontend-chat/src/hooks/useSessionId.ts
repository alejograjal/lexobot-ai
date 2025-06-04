import { v4 as uuidv4 } from 'uuid'
import { useState, useEffect } from 'react'

const SESSION_KEY = 'chat_session_id'
const SESSION_TIMESTAMP = 'chat_session_timestamp'
const TWO_HOURS = 2 * 60 * 60 * 1000

export function useSessionId() {
    const [sessionId, setSessionId] = useState<string>('')

    const generateNewSession = () => {
        const newSessionId = uuidv4()
        localStorage.setItem(SESSION_KEY, newSessionId)
        localStorage.setItem(SESSION_TIMESTAMP, Date.now().toString())
        setSessionId(newSessionId)
        return newSessionId
    }

    useEffect(() => {
        const storedSessionId = localStorage.getItem(SESSION_KEY)
        const timestamp = Number(localStorage.getItem(SESSION_TIMESTAMP))

        if (!storedSessionId || !timestamp || Date.now() - timestamp > TWO_HOURS) {
            generateNewSession()
        } else {
            setSessionId(storedSessionId)
        }
    }, [])

    const resetSession = () => {
        return generateNewSession()
    }

    return { sessionId, resetSession }
}