import { LoginForm } from "@/app/login/LoginForm"

export default function LoginPage() {
    return (
        <div className="bg-muted flex min-h-svh w-full items-center justify-center p-6 md:p-10">
            <div className="w-full max-w-sm">
                <LoginForm />
            </div>
        </div>
    )
}
