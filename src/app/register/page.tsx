import { RegisterForm } from "@/components/auth/register-form";

export default function RegisterPage() {
    return (
        <main className="flex min-h-[calc(100vh-80px)] items-center justify-center px-6 py-16">
            <div className="w-full max-w-md">
                <div className="mb-10 text-center">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-lyra-muted">
                        LYRA Account
                    </p>

                    <h1 className="font-display mt-3 text-4xl tracking-tight">
                        Create your account
                    </h1>

                    <p className="mx-auto mt-4 max-w-sm text-sm leading-6 text-lyra-muted">
                        Join LYRA and keep your shopping experience
                        beautifully simple.
                    </p>
                </div>

                <RegisterForm />
            </div>
        </main>
    );
}