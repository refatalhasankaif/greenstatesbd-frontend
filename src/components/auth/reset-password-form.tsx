"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { confirmPasswordReset, verifyPasswordResetCode } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import Link from "next/link";

type Status = "verifying" | "ready" | "success" | "invalid";

export default function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const oobCode = searchParams.get("oobCode") ?? "";

  const [status, setStatus] = useState<Status>("verifying");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Verify the oobCode from the URL on mount
  useEffect(() => {
    if (!oobCode) {
      setStatus("invalid");
      return;
    }
    verifyPasswordResetCode(auth, oobCode)
      .then((email) => {
        setEmail(email);
        setStatus("ready");
      })
      .catch(() => setStatus("invalid"));
  }, [oobCode]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    const form = new FormData(e.currentTarget);
    const password = form.get("password") as string;
    const confirm = form.get("confirm") as string;

    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      await confirmPasswordReset(auth, oobCode, password);
      setStatus("success");
      setTimeout(() => router.push("/login"), 2500);
    } catch (err: unknown) {
      const code = (err as { code?: string })?.code;
      if (code === "auth/expired-action-code") {
        setError("This reset link has expired. Please request a new one.");
      } else if (code === "auth/weak-password") {
        setError("Password is too weak. Use at least 6 characters.");
      } else {
        setError("Failed to reset password. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto space-y-5">

      {/* Verifying state */}
      {status === "verifying" && (
        <>
          <div className="text-center space-y-1">
            <h1 className="text-2xl font-semibold tracking-tight">Verifying link</h1>
            <p className="text-sm text-muted-foreground">Please wait a moment...</p>
          </div>
          <div className="flex justify-center py-6">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground"/>
          </div>
        </>
      )}

      {/* Invalid / expired link */}
      {status === "invalid" && (
        <>
          <div className="text-center space-y-1">
            <h1 className="text-2xl font-semibold tracking-tight">Link invalid</h1>
            <p className="text-sm text-muted-foreground">This reset link is invalid or has expired.</p>
          </div>
          <div className="flex flex-col items-center gap-4 py-4 text-center">
            <div className="h-14 w-14 rounded-full bg-destructive/10 flex items-center justify-center">
              <XCircle className="h-7 w-7 text-destructive"/>
            </div>
            <p className="text-sm text-muted-foreground">
              Reset links expire after 1 hour. Request a new one below.
            </p>
            <Button className="w-full h-10" asChild>
              <Link href="/forgot-password">Request new link</Link>
            </Button>
          </div>
        </>
      )}

      {/* Ready to set new password */}
      {status === "ready" && (
        <>
          <div className="text-center space-y-1">
            <h1 className="text-2xl font-semibold tracking-tight">Set new password</h1>
            {email && (
              <p className="text-sm text-muted-foreground">
                Setting password for <span className="font-medium text-foreground">{email}</span>
              </p>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <p className="text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-md">{error}</p>
            )}
            <div className="space-y-1.5">
              <label className="text-sm font-medium">New password</label>
              <Input
                name="password"
                type="password"
                placeholder="Min. 6 characters"
                required
                minLength={6}
                autoComplete="new-password"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Confirm new password</label>
              <Input
                name="confirm"
                type="password"
                placeholder="Repeat password"
                required
                autoComplete="new-password"
              />
            </div>
            <Button type="submit" className="w-full h-10" disabled={loading}>
              {loading
                ? <span className="flex items-center gap-2"><span className="h-4 w-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin"/>Updating...</span>
                : "Update password"}
            </Button>
          </form>
        </>
      )}

      {/* Success */}
      {status === "success" && (
        <>
          <div className="text-center space-y-1">
            <h1 className="text-2xl font-semibold tracking-tight">Password updated</h1>
            <p className="text-sm text-muted-foreground">Redirecting you to sign in...</p>
          </div>
          <div className="flex flex-col items-center gap-4 py-4 text-center">
            <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center">
              <CheckCircle className="h-7 w-7 text-primary"/>
            </div>
            <p className="text-sm text-muted-foreground">
              Your password has been updated successfully.
            </p>
            <Button variant="outline" className="w-full h-10" asChild>
              <Link href="/login">Go to sign in</Link>
            </Button>
          </div>
        </>
      )}

    </div>
  );
}