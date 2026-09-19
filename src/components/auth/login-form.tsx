"use client";

import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { signIn } from "next-auth/react";

const LoginSchema = z.object({
    email: z.string().trim().email("Please enter a valid email"),
    password: z.string().min(1, "Please enter your password"),
});

type LoginFormData = z.infer<typeof LoginSchema>;

export function LoginForm() {
    const [serverError, setServerError] = useState<string | null>(null);

    const { register, handleSubmit, formState: { errors, isSubmitting, } } = useForm({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    async function onSubmit(data: LoginFormData) {
        setServerError(null);

        const result = await signIn("credentials", {
            email: data.email,
            password: data.password,
            redirect: false,
        });

        if (!result || result.error) {
            setServerError("Invalid email or password");
            return;
        }
        window.location.href = "/account";
    }

    return (
        <form
            method="post"
            noValidate
            onSubmit={handleSubmit(onSubmit)}
            onKeyDown={(event) => {
                if (event.key === "Enter") {
                    event.preventDefault();
                    void handleSubmit(onSubmit)();
                }
            }}
            className="space-y-6"
        >
            {/* Email */}
            <div>
                <label
                    htmlFor="email"
                    className="text-[10px] uppercase tracking-[0.18em] text-lyra-muted"
                >
                    Email
                </label>

                <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    disabled={isSubmitting}
                    {...register("email")}
                    className="mt-2 w-full border border-lyra-border bg-lyra-white px-4 py-3.5 text-sm outline-none transition-colors placeholder:text-lyra-subtle focus:border-lyra-black disabled:cursor-not-allowed disabled:bg-lyra-beige/40"
                />

                {errors.email && (
                    <p className="mt-2 border border-red-300 bg-red-50 px-3 py-2 text-xs text-red-600">
                        {errors.email.message}
                    </p>
                )}
            </div>

            {/* Password */}
            <div>
                <label
                    htmlFor="password"
                    className="text-[10px] uppercase tracking-[0.18em] text-lyra-muted"
                >
                    Password
                </label>

                <input
                    id="password"
                    type="password"
                    autoComplete="current-password"
                    disabled={isSubmitting}
                    {...register("password")}
                    className="mt-2 w-full border border-lyra-border bg-lyra-white px-4 py-3.5 text-sm outline-none transition-colors placeholder:text-lyra-subtle focus:border-lyra-black disabled:cursor-not-allowed disabled:bg-lyra-beige/40"
                />

                {errors.password && (
                    <p className="mt-2 border border-red-300 bg-red-50 px-3 py-2 text-xs text-red-600">
                        {errors.password.message}
                    </p>
                )}
            </div>

            {/* Server Error */}
            {serverError && (
                <div className="border border-red-200 bg-red-50 px-4 py-3">
                    <p className="text-xs leading-5 text-red-700">
                        {serverError}
                    </p>
                </div>
            )}

            {/* Submit */}
            <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-lyra-black px-6 py-4 text-xs uppercase tracking-[0.18em] text-lyra-white transition-all duration-300 hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-40"
            >
                {isSubmitting ? "Signing In..." : "Sign In"}
            </button>

            {/* Register Link */}
            <p className="pt-1 text-center text-xs text-lyra-muted">
                Don't have an account?{" "}
                <Link
                    href="/register"
                    className="text-lyra-black underline underline-offset-4 transition-opacity hover:opacity-60"
                >
                    Create account
                </Link>
            </p>
        </form>
    );
}