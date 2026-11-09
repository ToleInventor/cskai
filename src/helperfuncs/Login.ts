import { backend_url } from "../main";

interface LoginResponse {
    token: string | null;
    userName: string;
    userId:number;
    success: boolean;
    reason?: string;
}

export default async function Login({ email, password }: { email: string; password: string }): Promise<boolean> {
    const response = await fetch(`${backend_url}/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password })
    });

    const data: LoginResponse = await response.json();

    if (response.ok && data.success && data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("username", data.userName);
        localStorage.setItem("id", data.userId.toString());
        return true;
    }

    return false;
}