import { backend_url } from "../main";

let loaded = false;

export default async function LoadStats() {
    const id = localStorage.getItem("id");
    const token = localStorage.getItem("token");
    
    if (!id || !token) {
        throw new Error('Missing credentials');
    }
    
    const response = await fetch(`${backend_url}/load_stats`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ id })
    });

    if (!response.ok) {
        let errorMessage = 'Failed to load stats';
        try {
            const errorData = await response.json();
            errorMessage = errorData.reason || errorMessage;
        } catch (e) {}
        throw new Error(errorMessage);
    }

    const data = await response.json();
    
    if (!Array.isArray(data) || data.length === 0) {
        throw new Error('No stats available');
    }
    
    const stats = data[0];
    localStorage.setItem("api_calls", String(stats.api_calls));
    localStorage.setItem("tokens_used", String(stats.tokens_used));
    localStorage.setItem("account_status", stats.account_status);
    loaded = true;
    return true;
}