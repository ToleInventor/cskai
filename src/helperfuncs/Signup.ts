import { backend_url } from "../main";

interface CreateAccountCredentials {
    username: string;
    email: string;
    password: string;
}

interface SignupResponse {
    success: boolean;
    reason: string;
}

export default async function CreateAccount({ username, email, password }: CreateAccountCredentials): Promise<{ success: boolean; reason: string }> {
    const response = await fetch(`${backend_url}/signup`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password })
    });

    const data: SignupResponse = await response.json();
    return { success: data.success, reason: data.reason };
}
