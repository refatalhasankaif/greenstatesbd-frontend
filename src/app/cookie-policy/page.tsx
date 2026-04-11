import BackHome from "@/components/BackHome";

export const metadata = { title: "Cookie Policy — GreenStatesBD" };

const sections = [
    {
        heading: "What Are Cookies",
        body: "Cookies are small text files stored on your device when you visit a website. They help the site remember your preferences, maintain sessions, and improve your overall experience on the platform.",
    },
    {
        heading: "Cookies We Use",
        body: "GreenStatesBD uses essential cookies (required for authentication and session management), functional cookies (to remember your preferences and language), and analytics cookies (to understand how users interact with the platform).",
    },
    {
        heading: "Third-Party Cookies",
        body: "Some features on GreenStatesBD — such as AI tools, map integrations, and analytics — may use cookies set by third-party services including Firebase, Google Analytics, and Cloudinary. These are governed by their respective privacy policies.",
    },
    {
        heading: "Managing Cookies",
        body: "You can control or delete cookies at any time through your browser settings. Please note that disabling essential cookies may affect core platform functionality such as staying logged in or accessing your dashboard.",
    },
    {
        heading: "Cookie Retention",
        body: "Session cookies are deleted when you close your browser. Persistent cookies remain on your device for a set period or until manually deleted. We do not retain cookie data longer than necessary for its stated purpose.",
    },
    {
        heading: "Updates to This Policy",
        body: "We may update this Cookie Policy as we introduce new features or third-party integrations. Changes will be reflected on this page with a revised date.",
    },
];

export default function CookiePolicyPage() {
    return (
        <main className="min-h-screen bg-background px-4 sm:px-6 lg:px-8 py-14 md:py-20">
            <div className="max-w-2xl mx-auto">
                <BackHome />

                <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground mb-3">
                    Cookie Policy
                </h1>
                <p className="text-sm text-muted-foreground mb-10">
                    Last updated: January 1, 2025
                </p>

                <p className="text-sm text-muted-foreground leading-7 mb-10">
                    This Cookie Policy explains how GreenStatesBD uses cookies and similar
                    tracking technologies when you visit or use our platform.
                </p>

                <div className="flex flex-col gap-8">
                    {sections.map((s, i) => (
                        <div key={s.heading}>
                            <h2 className="text-base font-bold text-foreground mb-2">
                                {i + 1}. {s.heading}
                            </h2>
                            <p className="text-sm text-muted-foreground leading-7">{s.body}</p>
                        </div>
                    ))}
                </div>

                <div className="mt-12 border-t border-border pt-8">
                    <p className="text-sm text-muted-foreground">
                        Cookie questions?{" "}
                        <a
                            href="mailto:support@greenstatesbd.com"
                            className="text-primary hover:underline underline-offset-4"
                        >
                            support@greenstatesbd.com
                        </a>
                    </p>
                </div>
            </div>
        </main>
    );
}