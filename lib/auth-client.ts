import { createAuthClient } from "better-auth/react";
import { adminClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000",
    plugins: [adminClient()],
    fetchOptions: {
        onError: async (context) => {
            const { response } = context;
            if (response.status === 429) {
                const retryAfter = response.headers.get("Retry-After");
                console.log(`Rate limit exceeded. Retry after ${retryAfter} seconds`);
            }
        },
        onSuccess: async (ctx) => {
            const authToken = ctx.response.headers.get("set-auth-token");
            if (authToken) {
                localStorage.setItem("bearer_token", authToken);
            }
        },
        auth: {
            type: "Bearer",
            token: () => localStorage.getItem("bearer_token") || "",
        },
    },
});

export const {
    signIn,
    signUp,
    useSession,
    signOut,
    verifyEmail,
    requestPasswordReset,
    resetPassword,
    sendVerificationEmail,
    revokeSession
    
} = authClient;

