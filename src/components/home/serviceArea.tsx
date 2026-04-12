"use client";

import React from "react";
import {
    Building2,
    Wheat,
    Anchor,
    Leaf,
    Ship,
    FlaskConical,
    Flower2,
    Theater,
} from "lucide-react";

const divisions = [
    {
        name: "Dhaka",
        tagline: "Capital & Commercial Heart",
        description:
            "The nerve center of Bangladesh. Dhaka hosts the capital city and is the most densely populated economic hub — with a booming real estate market spanning residential towers, commercial spaces, and smart city projects.",
        icon: Building2,
    },
    {
        name: "Chattogram",
        tagline: "Port City & Trade Gateway",
        description:
            "Home to Bangladesh's largest seaport and a thriving industrial belt. From hilltop residences to coastal properties, real estate opportunities here are vast and rapidly growing.",
        icon: Anchor,
    },
    {
        name: "Rajshahi",
        tagline: "Silk City & Mango Capital",
        description:
            "One of the cleanest cities in South Asia with a rising educational hub. Offers affordable and premium properties surrounded by lush landscapes and rich cultural heritage.",
        icon: Wheat,
    },
    {
        name: "Khulna",
        tagline: "Gateway to the Sundarbans",
        description:
            "Borders the world's largest mangrove forest. An industrial powerhouse with shipyards and shrimp industries — eco-friendly and riverside properties make it a truly unique market.",
        icon: Leaf,
    },
    {
        name: "Barishal",
        tagline: "Venice of the East",
        description:
            "A land of rivers and canals known for its waterway-connected lifestyle. With major infrastructure investment underway, Barishal is emerging as a promising real estate frontier.",
        icon: Ship,
    },
    {
        name: "Sylhet",
        tagline: "Tea Gardens & Spiritual Hub",
        description:
            "Famous for rolling tea gardens, haor wetlands, and strong NRB investment. Premium villas, gated communities, and spiritual tourism drive unique real estate demand across the division.",
        icon: FlaskConical,
    },
    {
        name: "Rangpur",
        tagline: "Agricultural Heartland",
        description:
            "The northern gateway of Bangladesh, rich in agricultural heritage and natural beauty. Growing industrial zones and major infrastructure projects are steadily pushing property values upward.",
        icon: Flower2,
    },
    {
        name: "Mymensingh",
        tagline: "Cultural Hub & Haor Region",
        description:
            "Home to one of Asia's oldest agricultural universities and a vibrant cultural scene. Offers affordable living with strong educational infrastructure and unique eco-property opportunities.",
        icon: Theater,
    },
];

const OurServiceArea = () => {
    return (
        <section
            id="service-area"
            className="w-full py-25 md:py-45 lg:py-60 px-4 sm:px-6 lg:px-8 bg-background"
        >
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-10 md:mb-14">
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground">
                        Our Service Area
                    </h2>
                    <p className="mt-4 text-muted-foreground text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
                        Covering all 8 divisions of Bangladesh with government-verified,
                        fraud-protected property listings — nationwide.
                    </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5">
                    {divisions.map((division) => {
                        const Icon = division.icon;
                        return (
                            <div
                                key={division.name}
                                className="group rounded-2xl border border-border bg-card p-6 md:p-7 transition-colors duration-200 hover:border-primary/50"
                            >
                                <Icon
                                    className="text-primary mb-4"
                                    size={28}
                                    strokeWidth={1.5}
                                />
                                <h3 className="text-base md:text-lg font-bold text-foreground mb-1">
                                    {division.name}
                                </h3>
                                <p className="text-xs font-semibold text-primary/80 mb-3 tracking-wide uppercase">
                                    {division.tagline}
                                </p>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    {division.description}
                                </p>
                            </div>
                        );
                    })}
                </div>

            </div>
        </section>
    );
};

export default OurServiceArea;