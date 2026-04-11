import BackHome from "@/components/BackHome";

export const metadata = { title: "Privacy Policy — GreenStatesBD" };

const sections = [
    {
        heading: "Information We Collect",
        body: "We collect information you provide directly — such as your name, email address, phone number, and property preferences when you register or use our services. We also collect usage data, device information, and cookies to improve platform performance.",
    },
    {
        heading: "How We Use Your Information",
        body: "Your information is used to operate and improve GreenStatesBD, process bids and transactions, send service-related communications, verify property listings, and provide AI-assisted recommendations tailored to your activity.",
    },
    {
        heading: "Data Sharing",
        body: "We do not sell your personal data. We may share information with trusted service providers (e.g. Cloudinary, Firebase) solely to operate the platform, and with government authorities when required by Bangladesh law.",
    },
    {
        heading: "Cookies",
        body: "GreenStatesBD uses cookies and similar technologies to maintain sessions, remember preferences, and analyze platform usage. You can control cookie settings through your browser. See our Cookie Policy for details.",
    },
    {
        heading: "Data Security",
        body: "We implement industry-standard security measures including encrypted authentication, role-based access control, and secure cloud infrastructure. However, no online service is 100% secure and we cannot guarantee absolute security.",
    },
    {
        heading: "Your Rights",
        body: "You have the right to access, correct, or delete your personal data at any time by contacting us at support@greenstatesbd.com. Accounts can be deactivated from your dashboard settings.",
    },
    {
        heading: "Changes to This Policy",
        body: "We may update this Privacy Policy from time to time. Significant changes will be communicated via email or a prominent notice on the platform. Continued use after changes constitutes acceptance.",
    },
];

export default function PrivacyPolicyPage() {
    return (
        <main className="min-h-screen bg-background px-4 sm:px-6 lg:px-8 py-14 md:py-20">
            <div className="max-w-2xl mx-auto">
                <BackHome />

                <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground mb-3">
                    Privacy Policy
                </h1>
                <p className="text-sm text-muted-foreground mb-10">
                    Last updated: January 1, 2025
                </p>

                <p className="text-sm text-muted-foreground leading-7 mb-10">
                    GreenStatesBD is committed to protecting your privacy.
                    This policy explains how we collect, use, and safeguard your personal
                    information when you use our platform.
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
                        Questions about this policy?{" "}
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