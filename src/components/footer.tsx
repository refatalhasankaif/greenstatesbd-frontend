"use client";

import Link from "next/link";
import Image from "next/image";
import { MapPin, Mail, Phone } from "lucide-react";
import { FaFacebook, FaInstagram, FaYoutube, FaXTwitter, FaGithub, FaLinkedin } from "react-icons/fa6";

const footerLinks = [
    {
        heading: "Home",
        links: [
            { label: "Hero",                      href: "/#hero" },
            { label: "Our Services",              href: "/#service" },
            { label: "Property Showcase",         href: "/#showcase" },
            { label: "Why Trust Us",              href: "/#why-trust-us" },
            { label: "Certification",             href: "/#certification" },
            { label: "Our Service Area",          href: "/#service-area" },
            { label: "About Us",                  href: "/#about" },
            { label: "FAQ",                       href: "/#faq" },
        ],
    },
    {
        heading: "Explore",
        links: [
            { label: "All Properties",   href: "/properties" },
            { label: "Gallery",          href: "/gallery" },
            { label: "Blogs",            href: "/blogs" },
            { label: "AI Chat",          href: "/ai" },
            { label: "Voice Assistant",  href: "/voice-assistant" },
            { label: "Dashboard",        href: "/dashboard" },
            { label: "Support",          href: "/support" },
        ],
    },
    {
        heading: "Legal",
        links: [
            { label: "Privacy Policy",   href: "/privacy-policy" },
            { label: "Terms of Service", href: "/terms" },
            { label: "Cookie Policy",    href: "/cookie-policy" },
            { label: "Refund Policy",    href: "/refund-policy" },
            { label: "Disclaimer",       href: "/disclaimer" },
            { label: "Contact Us",       href: "/contact" },
        ],
    },
];

const socials = [
    { icon: FaFacebook,  label: "Facebook",  href: "https://facebook.com/greenstatesbd" },
    { icon: FaInstagram, label: "Instagram", href: "https://instagram.com/greenstatesbd" },
    { icon: FaYoutube,   label: "YouTube",   href: "https://youtube.com/@greenstatesbd" },
    { icon: FaXTwitter,  label: "X/Twitter", href: "https://x.com/greenstatesbd" },
    { icon: FaGithub,    label: "GitHub",    href: "https://github.com/greenstatesbd" },
    { icon: FaLinkedin,  label: "LinkedIn",  href: "https://linkedin.com/company/greenstatesbd" },
];

const contact = [
    { icon: MapPin, text: "Dhaka, Bangladesh" },
    { icon: Mail,   text: "support@greenstatesbd.com",  href: "mailto:support@greenstatesbd.com" },
    { icon: Phone,  text: "+880 1700-000000",            href: "tel:+8801700000000" },
];

const Footer = () => {
    return (
        <footer className="w-full border-t border-border bg-background">

            {/* ── MAIN GRID ── */}
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14 md:py-16 lg:py-20">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">

                    {/* Brand column — spans 2 cols on lg */}
                    <div className="sm:col-span-2 lg:col-span-2 flex flex-col gap-6">
                        {/* Logo + name */}
                        <Link href="/" className="flex items-center gap-2.5 w-fit">
                            <Image
                                src="/logo.png"
                                alt="GreenStatesBD logo"
                                width={36}
                                height={36}
                                className="object-contain"
                            />
                            <span className="font-extrabold text-lg tracking-tight text-foreground">
                                GreenStatesBD
                            </span>
                        </Link>

                        {/* Description */}
                        <p className="text-sm text-muted-foreground leading-7 max-w-xs">
                            A modern, full-stack real estate bidding platform designed for
                            Bangladesh — combining real-time bidding, AI-powered assistance,
                            and government-certified listings for a secure, transparent
                            property experience.
                        </p>

                        {/* Contact */}
                        <ul className="flex flex-col gap-3.5">
                            {contact.map(({ icon: Icon, text, href }) => (
                                <li key={text}>
                                    {href ? (
                                        <a
                                            href={href}
                                            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer"
                                        >
                                            <Icon size={14} strokeWidth={1.75} className="text-primary shrink-0" />
                                            {text}
                                        </a>
                                    ) : (
                                        <span className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <Icon size={14} strokeWidth={1.75} className="text-primary shrink-0" />
                                            {text}
                                        </span>
                                    )}
                                </li>
                            ))}
                        </ul>

                        {/* Socials */}
                        <div className="flex items-center gap-2 flex-wrap">
                            {socials.map(({ icon: Icon, label, href }) => (
                                <a
                                    key={label}
                                    href={href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={label}
                                    className="h-9 w-9 flex items-center justify-center rounded-lg border border-border bg-card hover:border-primary/50 hover:text-primary text-muted-foreground transition-colors cursor-pointer"
                                >
                                    <Icon size={15} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Link columns */}
                    {footerLinks.map((col) => (
                        <div key={col.heading} className="flex flex-col gap-4">
                            <p className="text-xs font-bold uppercase tracking-widest text-foreground">
                                {col.heading}
                            </p>
                            <ul className="flex flex-col gap-2.5">
                                {col.links.map(({ label, href }) => (
                                    <li key={label}>
                                        <Link
                                            href={href}
                                            className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer"
                                        >
                                            {label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}

                </div>
            </div>

            {/* ── BOTTOM BAR ── */}
            <div className="border-t border-border">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-center">
                    <p className="text-xs text-muted-foreground text-center">
                        &copy; {new Date().getFullYear()} GreenStatesBD. All rights reserved.
                    </p>
                </div>
            </div>

        </footer>
    );
};

export { Footer };