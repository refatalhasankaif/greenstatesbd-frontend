"use client";

import { useState } from "react";
import Link from "next/link";
import { sendPasswordResetEmail, ActionCodeSettings } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckCircle } from "lucide-react";

export default function ForgotPasswordForm() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);
    const [error, setError] = useState("");

    const handleReset = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            const actionCodeSettings: ActionCodeSettings = {
                // Firebase will append ?oobCode=...&mode=resetPassword to this URL
                // Your existing ResetPasswordForm already reads oobCode from searchParams ✅
                url: `${process.env.NEXT_PUBLIC_APP_URL}/reset-password`,
                handleCodeInApp: false,
            };

            await sendPasswordResetEmail(auth, email, actionCodeSettings);
            setSent(true);
        } catch (err: unknown) {
            console.error("RESET ERROR:", err);
            const code = (err as { code?: string })?.code;
            if (code === "auth/user-not-found") {
                setError("No account found with this email address.");
            } else if (code === "auth/invalid-email") {
                setError("Please enter a valid email address.");
            } else {
                setError("Failed to send reset email. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-sm mx-auto space-y-5">
            {/* Header */}
            <div className="text-center space-y-1">
                <h1 className="text-2xl font-semibold tracking-tight">Reset your password</h1>
                <p className="text-sm text-muted-foreground">
                    {sent
                        ? "Check your inbox for the reset link"
                        : "Enter your email and we'll send you a reset link"}
                </p>
            </div>

            {sent ? (
                <div className="flex flex-col items-center gap-4 py-4 text-center">
                    <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center">
                        <CheckCircle className="h-7 w-7 text-primary" />
                    </div>
                    <div className="space-y-1">
                        <p className="font-medium text-sm">Email sent successfully</p>
                        <p className="text-sm text-muted-foreground">
                            We sent a reset link to{" "}
                            <span className="font-medium text-foreground">{email}</span>.
                            Check your spam folder if you don&apos;t see it.
                        </p>
                    </div>
                    <Button
                        variant="outline"
                        className="w-full h-10 mt-2"
                        onClick={() => {
                            setSent(false);
                            setEmail("");
                        }}
                    >
                        Send to a different email
                    </Button>
                </div>
            ) : (
                <form onSubmit={handleReset} className="space-y-4">
                    {error && (
                        <p className="text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-md">
                            {error}
                        </p>
                    )}
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium">Email address</label>
                        <Input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            required
                            autoComplete="email"
                        />
                    </div>
                    <Button type="submit" className="w-full h-10" disabled={loading}>
                        {loading ? (
                            <span className="flex items-center gap-2">
                                <span className="h-4 w-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                                Sending...
                            </span>
                        ) : (
                            "Send reset link"
                        )}
                    </Button>
                </form>
            )}

            <p className="text-sm text-center text-muted-foreground">
                Remembered your password?{" "}
                <Link
                    href="/login"
                    className="text-foreground font-medium hover:underline underline-offset-2"
                >
                    Back to sign in
                </Link>
            </p>
        </div>
    );
}