"use client";

import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { registerUser } from "@/lib/actions/auth.actions";

const RegisterSchema = z
    .object({
        name: z
            .string()
            .trim()
            .min(2, "Name must be at least 2 characters"),

        email: z
            .string()
            .trim()
            .email("Please enter a valid email"),

        password: z
            .string()
            .min(8, "Password must be at least 8 characters"),

        confirmPassword: z.string(),
    })
    .refine(
        (data) => data.password === data.confirmPassword,
        {
            path: ["confirmPassword"],
            message: "Passwords do not match",
        }
    );

type RegisterFormData = z.infer<typeof RegisterSchema>;

export function RegisterForm() {
    const [serverError, setServerError] = useState<string | null>(
        null
    );
    const [isSuccess, setIsSuccess] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<RegisterFormData>({
        resolver: zodResolver(RegisterSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
    });

    async function onSubmit(data: RegisterFormData) {
        setServerError(null);
        setIsSuccess(false);

        try {
            await registerUser(
                data.name,
                data.email,
                data.password
            );

            setIsSuccess(true);
        } catch (error) {
            setServerError(
                error instanceof Error
                    ? error.message
                    : "Something went wrong"
            );
        }
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
            {/* Name */}
            <div>
                <label
                    htmlFor="name"
                    className="text-[10px] uppercase tracking-[0.18em] text-lyra-muted"
                >
                    Name
                </label>

                <input
                    id="name"
                    type="text"
                    autoComplete="name"
                    disabled={isSuccess}
                    {...register("name")}
                    className="mt-2 w-full border border-lyra-border bg-lyra-white px-4 py-3.5 text-sm outline-none transition-colors placeholder:text-lyra-subtle focus:border-lyra-black disabled:cursor-not-allowed disabled:bg-lyra-beige/40"
                    placeholder="Your name"
                />

                {errors.name && (
                    <p className="mt-2 border border-red-300 bg-red-50 px-4 py-3 text-xs text-red-600">
                        {errors.name.message}
                    </p>
                )}
            </div>

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
                    disabled={isSuccess}
                    {...register("email")}
                    className="mt-2 w-full border border-lyra-border bg-lyra-white px-4 py-3.5 text-sm outline-none transition-colors placeholder:text-lyra-subtle focus:border-lyra-black disabled:cursor-not-allowed disabled:bg-lyra-beige/40"
                    placeholder="you@example.com"
                />

                {errors.email && (
                    <p className="mt-2 border border-red-300 bg-red-50 px-4 py-3 text-xs text-red-600">
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
                    autoComplete="new-password"
                    disabled={isSuccess}
                    {...register("password")}
                    className="mt-2 w-full border border-lyra-border bg-lyra-white px-4 py-3.5 text-sm outline-none transition-colors placeholder:text-lyra-subtle focus:border-lyra-black disabled:cursor-not-allowed disabled:bg-lyra-beige/40"
                    placeholder="Minimum 8 characters"
                />

                {errors.password && (
                    <p className="mt-2 border border-red-300 bg-red-50 px-4 py-3 text-xs text-red-600">
                        {errors.password.message}
                    </p>
                )}
            </div>

            {/* Confirm Password */}
            <div>
                <label
                    htmlFor="confirmPassword"
                    className="text-[10px] uppercase tracking-[0.18em] text-lyra-muted"
                >
                    Confirm Password
                </label>

                <input
                    id="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    disabled={isSuccess}
                    {...register("confirmPassword")}
                    className="mt-2 w-full border border-lyra-border bg-lyra-white px-4 py-3.5 text-sm outline-none transition-colors placeholder:text-lyra-subtle focus:border-lyra-black disabled:cursor-not-allowed disabled:bg-lyra-beige/40"
                    placeholder="Re-enter your password"
                />

                {errors.confirmPassword && (
                    <p className="mt-2 border border-red-300 bg-red-50 px-4 py-3 text-xs text-red-600">
                        {errors.confirmPassword.message}
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

            {/* Success */}
            {isSuccess && (
                <div className="border border-green-200 bg-green-50 px-4 py-3">
                    <p className="text-xs leading-5 text-green-700">
                        Account created successfully.
                    </p>
                </div>
            )}

            {/* Submit */}
            <button
                type="submit"
                disabled={isSubmitting || isSuccess}
                className="w-full bg-lyra-black px-6 py-4 text-xs uppercase tracking-[0.18em] text-lyra-white transition-all duration-300 hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-40"
            >
                {isSubmitting
                    ? "Creating Account..."
                    : isSuccess
                        ? "Account Created"
                        : "Create Account"}
            </button>

            {/* Login Link */}
            <p className="pt-1 text-center text-xs text-lyra-muted">
                Already have an account?{" "}
                <Link
                    href="/login"
                    className="text-lyra-black underline underline-offset-4 transition-opacity hover:opacity-60"
                >
                    Sign in
                </Link>
            </p>
        </form>
    );
}