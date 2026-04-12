"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
    {
        question: "What is GreenStatesBD?",
        answer:
            "GreenStatesBD is a modern, full-stack real estate platform that enables users to explore verified properties, place competitive bids, communicate directly with agents, and get AI-powered guidance — all within a secure, government-certified ecosystem.",
    },
    {
        question: "How does the bidding system work?",
        answer:
            "Once you find a property you're interested in, you can place a bid in real-time. The platform uses live Socket.IO updates so all participants see the latest bids instantly. Each bid is tracked, timestamped, and tied to your verified account — ensuring a fair and transparent process.",
    },
    {
        question: "Are all property listings verified?",
        answer:
            "Yes. Every listing on GreenStatesBD goes through a structured verification process under Bangladesh government property standards. Our platform also has an active fraud-reporting pipeline and a dedicated Moderator role to remove fake or misleading listings.",
    },
    {
        question: "What roles exist on the platform?",
        answer:
            "GreenStatesBD has a five-role architecture: User (browse, bid, chat), Manager (approve listings, oversee handover), Admin (full system control), Moderator (fraud review and removal), and Support Agent (live chat support). Each role has a personalized dashboard with role-specific tools.",
    },
    {
        question: "What AI features are available?",
        answer:
            "The platform includes an AI Chat Assistant to guide users through property decisions, an AI Blog Generator for content creation, and a Voice Assistant for an interactive, hands-free experience — all integrated directly into the platform.",
    },
    {
        question: "Can I chat with an agent directly?",
        answer:
            "Yes. GreenStatesBD features a real-time 1-to-1 live chat system powered by Socket.IO. Users can communicate with agents and support staff directly. The platform is also WebRTC-ready, enabling voice and video call capabilities.",
    },
    {
        question: "How is my data and account kept secure?",
        answer:
            "Authentication is handled via Firebase with secure session management. The platform enforces role-based access control, meaning users can only access functionality relevant to their role. All property transactions are monitored and logged by the management team.",
    },
    {
        question: "Is GreenStatesBD available across all of Bangladesh?",
        answer:
            "Yes. GreenStatesBD covers all 8 divisions of Bangladesh — Dhaka, Chattogram, Rajshahi, Khulna, Barishal, Sylhet, Rangpur, and Mymensingh — with listings spanning all 64 districts.",
    },
];

const FaqItem = ({
    faq,
    isOpen,
    onToggle,
}: {
    faq: (typeof faqs)[0];
    isOpen: boolean;
    onToggle: () => void;
}) => {
    return (
        <div className="border border-border rounded-2xl overflow-hidden transition-colors duration-200 hover:border-primary/40">
            <button
                onClick={onToggle}
                className="w-full flex items-center justify-between gap-4 px-5 md:px-6 py-4 md:py-5 text-left bg-card hover:bg-muted/40 transition-colors duration-200 cursor-pointer"
                aria-expanded={isOpen}
            >
                <span className="text-sm md:text-base font-semibold text-foreground leading-snug">
                    {faq.question}
                </span>
                <ChevronDown
                    className={`shrink-0 text-primary transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                    size={18}
                    strokeWidth={2}
                />
            </button>

            <div
                className={`grid transition-all duration-300 ease-in-out ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                    }`}
            >
                <div className="overflow-hidden">
                    <p className="px-5 md:px-6 pb-5 pt-1 text-sm text-muted-foreground leading-relaxed border-t border-border">
                        {faq.answer}
                    </p>
                </div>
            </div>
        </div>
    );
};

const FaqSection = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    const toggle = (i: number) => setOpenIndex(openIndex === i ? null : i);

    return (
        <section
            id="faq"
            className="w-full py-25 md:py-45 lg:py-60 px-4 sm:px-6 lg:px-8 bg-background"
        >
            <div className="max-w-3xl mx-auto">

                <div className="text-center mb-10 md:mb-14">
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground">
                        Frequently Asked Questions
                    </h2>
                    <p className="mt-4 text-muted-foreground text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
                        Everything you need to know about GreenStatesBD — from how bidding works
                        to platform security and nationwide coverage.
                    </p>
                </div>

                <div className="flex flex-col gap-3">
                    {faqs.map((faq, i) => (
                        <FaqItem
                            key={i}
                            faq={faq}
                            isOpen={openIndex === i}
                            onToggle={() => toggle(i)}
                        />
                    ))}
                </div>

                <div className="mt-10 text-center">
                    <p className="text-sm text-muted-foreground">
                        Still have questions?{" "}
                        <a
                            href="/support"
                            className="text-primary font-semibold hover:underline underline-offset-4 transition-all"
                        >
                            Talk to our support team
                        </a>
                    </p>
                </div>

            </div>
        </section>
    );
};

export default FaqSection;