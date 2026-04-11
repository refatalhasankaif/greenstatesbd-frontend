import BackHome from "@/components/BackHome";

export const metadata = { title: "Disclaimer — GreenStatesBD" };

const sections = [
    {
        heading: "General Information Only",
        body: "The content available on GreenStatesBD — including property listings, pricing estimates, location data, and AI-generated suggestions — is provided for general informational purposes only. It does not constitute professional legal, financial, or real estate advice.",
    },
    {
        heading: "Listing Accuracy",
        body: "While GreenStatesBD makes every effort to verify listings through our government-certified process, we cannot guarantee the absolute accuracy, completeness, or timeliness of all listing information. Property details may change without notice.",
    },
    {
        heading: "AI-Generated Content",
        body: "AI tools on the platform — including the AI Chat Assistant, Blog Generator, and Voice Assistant — produce content based on patterns and training data. This content should not be treated as professional advice. Always consult qualified professionals for legal or financial decisions.",
    },
    {
        heading: "No Warranties",
        body: "GreenStatesBD is provided on an 'as is' and 'as available' basis without warranties of any kind, either express or implied. We do not warrant that the platform will be uninterrupted, error-free, or free of viruses or other harmful components.",
    },
    {
        heading: "Third-Party Links",
        body: "Our platform may contain links to third-party websites or services. GreenStatesBD has no control over and assumes no responsibility for the content, privacy policies, or practices of any third-party sites.",
    },
    {
        heading: "Investment Risk",
        body: "Real estate investment carries inherent financial risk. GreenStatesBD does not guarantee investment returns or property value appreciation. All property decisions should be made with independent due diligence and professional consultation.",
    },
];

export default function DisclaimerPage() {
    return (
        <main className="min-h-screen bg-background px-4 sm:px-6 lg:px-8 py-14 md:py-20">
            <div className="max-w-2xl mx-auto">
                <BackHome />

                <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground mb-3">
                    Disclaimer
                </h1>
                <p className="text-sm text-muted-foreground mb-10">
                    Last updated: January 1, 2025
                </p>

                <p className="text-sm text-muted-foreground leading-7 mb-10">
                    By using GreenStatesBD, you acknowledge and agree to the limitations
                    described in this disclaimer. Please read it carefully.
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
                        For clarifications:{" "}
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