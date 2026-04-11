"use client";

import { useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import BackHome from "@/components/BackHome";
import { Mail, MapPin, Phone, Send, Loader2 } from "lucide-react";

type Status = "idle" | "loading" | "success" | "error";

const contactInfo = [
    { icon: MapPin, label: "Address",  value: "Dhaka, Bangladesh" },
    { icon: Mail,   label: "Email",    value: "support@greenstatesbd.com", href: "mailto:support@greenstatesbd.com" },
    { icon: Phone,  label: "Phone",    value: "+880 1700-000000",           href: "tel:+8801700000000" },
];

export default function ContactPage() {
    const formRef = useRef<HTMLFormElement>(null);
    const [status, setStatus] = useState<Status>("idle");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formRef.current) return;

        setStatus("loading");

        try {
            await emailjs.sendForm(
                process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
                process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
                formRef.current,
                process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!
            );
            setStatus("success");
            formRef.current.reset();
        } catch {
            setStatus("error");
        }
    };

    return (
        <main className="min-h-screen bg-background px-4 sm:px-6 lg:px-8 py-14 md:py-20">
            <div className="max-w-4xl mx-auto">
                <BackHome />

                <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground mb-3">
                    Contact Us
                </h1>
                <p className="text-sm text-muted-foreground mb-12 max-w-xl leading-7">
                    Have a question, feedback, or need support? Fill in the form and our team
                    will get back to you within 24 hours.
                </p>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-14">

                    {/* ── CONTACT INFO ── */}
                    <div className="lg:col-span-2 flex flex-col gap-6">
                        {contactInfo.map(({ icon: Icon, label, value, href }) => (
                            <div key={label} className="flex items-start gap-4">
                                <div className="mt-0.5 h-9 w-9 shrink-0 flex items-center justify-center rounded-lg border border-border bg-card">
                                    <Icon size={15} strokeWidth={1.75} className="text-primary" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-0.5">
                                        {label}
                                    </p>
                                    {href ? (
                                        <a
                                            href={href}
                                            className="text-sm text-foreground hover:text-primary transition-colors cursor-pointer"
                                        >
                                            {value}
                                        </a>
                                    ) : (
                                        <p className="text-sm text-foreground">{value}</p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* ── FORM ── */}
                    <form
                        ref={formRef}
                        onSubmit={handleSubmit}
                        className="lg:col-span-3 flex flex-col gap-4"
                    >
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="flex flex-col gap-1.5">
                                <label htmlFor="user_name" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                    Full Name
                                </label>
                                <input
                                    id="user_name"
                                    name="user_name"
                                    type="text"
                                    required
                                    placeholder="John Doe"
                                    className="h-10 w-full rounded-lg border border-border bg-card px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary transition"
                                />
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label htmlFor="user_email" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                    Email Address
                                </label>
                                <input
                                    id="user_email"
                                    name="user_email"
                                    type="email"
                                    required
                                    placeholder="you@example.com"
                                    className="h-10 w-full rounded-lg border border-border bg-card px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary transition"
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label htmlFor="subject" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                Subject
                            </label>
                            <input
                                id="subject"
                                name="subject"
                                type="text"
                                required
                                placeholder="How can we help?"
                                className="h-10 w-full rounded-lg border border-border bg-card px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary transition"
                            />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label htmlFor="message" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                Message
                            </label>
                            <textarea
                                id="message"
                                name="message"
                                required
                                rows={5}
                                placeholder="Write your message here..."
                                className="w-full rounded-lg border border-border bg-card px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary transition resize-none"
                            />
                        </div>

                        {/* Status messages */}
                        {status === "success" && (
                            <p className="text-sm text-green-600 dark:text-green-400 font-medium">
                                Message sent successfully. We will get back to you soon.
                            </p>
                        )}
                        {status === "error" && (
                            <p className="text-sm text-red-600 dark:text-red-400 font-medium">
                                Something went wrong. Please try again or email us directly.
                            </p>
                        )}

                        <button
                            type="submit"
                            disabled={status === "loading"}
                            className="mt-1 h-10 w-full sm:w-auto sm:px-8 inline-flex items-center justify-center gap-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                        >
                            {status === "loading" ? (
                                <>
                                    <Loader2 size={15} className="animate-spin" />
                                    Sending...
                                </>
                            ) : (
                                <>
                                    <Send size={14} />
                                    Send Message
                                </>
                            )}
                        </button>
                    </form>

                </div>
            </div>
        </main>
    );
}