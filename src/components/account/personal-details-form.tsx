"use client";

import { useState } from "react";

import { updateAccountName } from "@/lib/actions/account.actions";

type PersonalDetailsFormProps = {
    name: string;
    email: string;
};

export function PersonalDetailsForm({
    name,
    email,
}: PersonalDetailsFormProps) {
    const [currentName, setCurrentName] = useState(name);
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    async function handleSubmit(
        event: React.FormEvent<HTMLFormElement>
    ) {
        event.preventDefault();

        setMessage("");
        setError("");

        try {
            setIsSaving(true);

            const updatedUser =
                await updateAccountName(currentName);

            setCurrentName(updatedUser.name ?? currentName);
            setMessage("Your personal details have been updated.");
        } catch (error) {
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError("Something went wrong. Please try again.");
            }
        } finally {
            setIsSaving(false);
        }
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="border border-lyra-border bg-lyra-white p-8 sm:p-10 lg:p-12"
        >
            <div className="space-y-10">
                <div>
                    <label
                        htmlFor="name"
                        className="block text-[10px] uppercase tracking-[0.18em] text-lyra-muted"
                    >
                        Full Name
                    </label>

                    <input
                        id="name"
                        name="name"
                        type="text"
                        value={currentName}
                        onChange={(event) =>
                            setCurrentName(event.target.value)
                        }
                        disabled={isSaving}
                        className="mt-3 w-full border-0 border-b border-lyra-border bg-transparent px-0 py-3 text-sm text-lyra-black outline-none transition-colors focus:border-lyra-black disabled:opacity-60"
                    />
                </div>

                <div>
                    <label
                        htmlFor="email"
                        className="block text-[10px] uppercase tracking-[0.18em] text-lyra-muted"
                    >
                        Email Address
                    </label>

                    <input
                        id="email"
                        name="email"
                        type="email"
                        value={email}
                        disabled
                        readOnly
                        className="mt-3 w-full border-0 border-b border-lyra-border bg-transparent px-0 py-3 text-sm text-lyra-muted outline-none"
                    />

                    <p className="mt-3 text-xs leading-5 text-lyra-muted">
                        Your email address is linked to your LYRA account and
                        cannot be changed here.
                    </p>
                </div>

                {error && (
                    <p
                        role="alert"
                        className="text-xs leading-5 text-red-600"
                    >
                        {error}
                    </p>
                )}

                {message && (
                    <p
                        role="status"
                        className="text-xs leading-5 text-lyra-muted"
                    >
                        {message}
                    </p>
                )}

                <button
                    type="submit"
                    disabled={isSaving}
                    className="w-full bg-lyra-black px-7 py-4 text-xs uppercase tracking-[0.18em] text-lyra-white transition-opacity hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {isSaving ? "Saving..." : "Save Changes"}
                </button>
            </div>
        </form>
    );
}