"use client";

import {
    Building2,
    Gavel,
    Sparkles,
    ShieldCheck,
    MessageCircle,
    BarChart3,
} from "lucide-react";

const services = [
    {
        title: "Property Listings",
        desc: "Browse premium verified properties with full transparency and details.",
        icon: <Building2 size={28} />,
    },
    {
        title: "Real-time Bidding",
        desc: "Participate in live bidding with instant updates and fair pricing.",
        icon: <Gavel size={28} />,
    },
    {
        title: "AI Assistant",
        desc: "Get smart recommendations and property insights powered by AI.",
        icon: <Sparkles size={28} />,
    },
    {
        title: "Secure Transactions",
        desc: "End-to-end secure process ensuring trust and safety.",
        icon: <ShieldCheck size={28} />,
    },
    {
        title: "Live Support",
        desc: "Instant chat and support sessions whenever you need help.",
        icon: <MessageCircle size={28} />,
    },
    {
        title: "Analytics Dashboard",
        desc: "Track bids, trends, and performance in real-time.",
        icon: <BarChart3 size={28} />,
    },
];

const Services = () => {
    return (
        <section id="service" className="relative py-25 md:py-45 lg:py-65 w-full bg-background">

            <div className="px-4 pb-20">
                <div className="text-center max-w-2xl mx-auto mb-12 space-y-4">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">
                        Our Services
                    </h2>
                    <p className="text-muted-foreground text-sm sm:text-base">
                        Everything you need to discover, analyze, and secure your perfect property — all in one platform.
                    </p>
                </div>

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
                    {services.map((service, i) => (
                        <div
                            key={i}
                            className="group relative rounded-xl border p-6 bg-background/60 backdrop-blur transition-all duration-300 hover:-translate-y-2 hover:shadow-xl cursor-pointer"
                        >


                            <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition bg-linear-to-br from-primary/10 to-transparent" />


                            <div className="mb-4 text-primary transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                                {service.icon}
                            </div>

                            <h3 className="text-lg font-semibold mb-2">
                                {service.title}
                            </h3>


                            <p className="text-sm text-muted-foreground">
                                {service.desc}
                            </p>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
};

export default Services;