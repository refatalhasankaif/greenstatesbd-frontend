"use client";

import React from "react";
import {
    Gavel,
    Bot,
    MessageSquare,
    ShieldCheck,
    LayoutDashboard,
    Users,
} from "lucide-react";

const features = [
    {
        icon: Gavel,
        title: "Property & Bidding",
        description:
            "Browse verified listings and participate in a real-time competitive bidding system with live price updates and curated recommendations.",
    },
    {
        icon: Bot,
        title: "AI-Powered Tools",
        description:
            "An integrated AI chat assistant, blog content generator, and voice assistant — built to guide users and simplify every decision.",
    },
    {
        icon: MessageSquare,
        title: "Real-Time Communication",
        description:
            "1-to-1 live chat via Socket.IO, dedicated support sessions with agents, and WebRTC-ready voice and video call infrastructure.",
    },
    {
        icon: ShieldCheck,
        title: "Security & Verification",
        description:
            "Every listing goes through a structured verification and fraud-reporting pipeline backed by Firebase authentication and role-based access control.",
    },
    {
        icon: LayoutDashboard,
        title: "Role-Based Dashboards",
        description:
            "Personalized dashboards for every role — User, Manager, Admin, Moderator, and Support Agent — each with tailored tools and analytics.",
    },
    {
        icon: Users,
        title: "Multi-Role Architecture",
        description:
            "A five-role system ensuring clear responsibilities: property approvals, fraud moderation, live support, and full administrative control.",
    },
];


const AboutSection = () => {
    return (
        <section
            id="about"
            className="w-full py-25 md:py-45 lg:py-60 px-4 sm:px-6 lg:px-8 bg-background"
        >
            <div className="max-w-6xl mx-auto">

                <div className="text-center mb-12 md:mb-16">
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground">
                        About GreenStatesBD
                    </h2>
                    <p className="mt-5 text-muted-foreground text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
                        GreenStatesBD is a modern, full-stack real estate platform designed to make
                        property buying, selling, and bidding <span className="text-foreground font-semibold">secure, transparent, and intelligent</span>.
                        It combines real-time communication, AI-powered assistance, and role-based
                        management to deliver a production-ready, enterprise-level experience.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 mb-14 md:mb-20">
                    {features.map(({ icon: Icon, title, description }) => (
                        <div
                            key={title}
                            className="rounded-2xl border border-border bg-card p-6 md:p-7 hover:border-primary/50 transition-colors duration-200"
                        >
                            <Icon className="text-primary mb-4" size={26} strokeWidth={1.5} />
                            <h3 className="text-base font-bold text-foreground mb-2">{title}</h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
                        </div>
                    ))}
                </div>

                <div className="rounded-2xl border border-primary/30 bg-primary/5 px-6 sm:px-10 py-8 sm:py-10 text-center">
                    <h3 className="text-xl sm:text-2xl font-extrabold text-foreground mb-3">
                        Our Vision
                    </h3>
                    <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                        GreenStatesBD aims to revolutionize the real estate experience in Bangladesh by
                        introducing full <span className="text-foreground font-semibold">transaction transparency</span>,{" "}
                        <span className="text-foreground font-semibold">smart bidding mechanisms</span>,{" "}
                        <span className="text-foreground font-semibold">AI-assisted decision making</span>, and a
                        fully verified, fraud-free property ecosystem — nationwide.
                    </p>
                </div>
            </div>
        </section>
    );
};

export default AboutSection;