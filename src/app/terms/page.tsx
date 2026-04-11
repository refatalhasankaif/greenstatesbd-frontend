import BackHome from "@/components/BackHome";

export const metadata = { title: "Terms of Service — GreenStatesBD" };

const sections = [
    {
        heading: "Acceptance of Terms",
        body: "By accessing or using GreenStatesBD, you agree to be bound by these Terms of Service and all applicable laws and regulations of Bangladesh. If you do not agree, please discontinue use immediately.",
    },
    {
        heading: "User Accounts",
        body: "You must provide accurate information when creating an account. You are responsible for maintaining the confidentiality of your credentials and for all activity that occurs under your account. Notify us immediately of any unauthorized use.",
    },
    {
        heading: "Property Listings",
        body: "All listings submitted to GreenStatesBD must be accurate, legally owned or authorized for listing, and comply with Bangladesh property regulations. Fraudulent, misleading, or duplicate listings will be removed and may result in account suspension.",
    },
    {
        heading: "Bidding System",
        body: "Bids placed on the platform are legally binding expressions of intent. Withdrawing a confirmed bid without valid reason may result in penalties, account restrictions, or legal action in accordance with applicable law.",
    },
    {
        heading: "Prohibited Conduct",
        body: "You may not use GreenStatesBD to engage in fraud, harassment, impersonation, money laundering, or any activity that violates Bangladesh law. Scraping, reverse engineering, or interfering with platform systems is strictly prohibited.",
    },
    {
        heading: "Limitation of Liability",
        body: "GreenStatesBD facilitates property transactions but is not a party to any agreement between buyers and sellers. We are not liable for any direct, indirect, or consequential damages arising from use of the platform or transactions conducted through it.",
    },
    {
        heading: "Termination",
        body: "We reserve the right to suspend or terminate your account at any time for violations of these terms, fraudulent activity, or at our sole discretion with or without notice.",
    },
    {
        heading: "Governing Law",
        body: "These Terms are governed by the laws of the People's Republic of Bangladesh. Any disputes shall be subject to the exclusive jurisdiction of courts in Dhaka, Bangladesh.",
    },
];

export default function TermsPage() {
    return (
        <main className="min-h-screen bg-background px-4 sm:px-6 lg:px-8 py-14 md:py-20">
            <div className="max-w-2xl mx-auto">
                <BackHome />

                <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground mb-3">
                    Terms of Service
                </h1>
                <p className="text-sm text-muted-foreground mb-10">
                    Last updated: January 1, 2025
                </p>

                <p className="text-sm text-muted-foreground leading-7 mb-10">
                    Please read these Terms of Service carefully before using GreenStatesBD.
                    These terms govern your access to and use of our platform, services, and features.
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
                        For legal inquiries:{" "}
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