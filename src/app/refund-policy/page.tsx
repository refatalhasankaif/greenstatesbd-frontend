import BackHome from "@/components/BackHome";

export const metadata = { title: "Refund Policy — GreenStatesBD" };

const sections = [
    {
        heading: "Platform Fees",
        body: "GreenStatesBD may charge service fees for premium listings, featured placements, or transaction facilitation. These fees are clearly disclosed before any payment is processed.",
    },
    {
        heading: "Eligibility for Refund",
        body: "Refunds may be issued if: (a) a service fee was charged in error, (b) a verified technical fault prevented service delivery, or (c) a listing was removed by our team due to no fault of the submitting user.",
    },
    {
        heading: "Non-Refundable Situations",
        body: "Fees are non-refundable if: a listing was removed due to policy violations or fraud, a bid was placed and confirmed, or a service was fully delivered as described. Change of mind does not qualify for a refund.",
    },
    {
        heading: "Requesting a Refund",
        body: "To request a refund, contact us at support@greenstatesbd.com within 7 days of the transaction with your transaction ID and a clear explanation. Requests submitted after 7 days will not be processed.",
    },
    {
        heading: "Processing Time",
        body: "Approved refunds are processed within 7–14 business days depending on your payment method and bank. GreenStatesBD is not responsible for delays caused by third-party payment processors.",
    },
    {
        heading: "Property Transactions",
        body: "GreenStatesBD facilitates property connections but is not a party to buyer-seller agreements. Refund or compensation disputes arising from property transactions must be resolved directly between the parties involved.",
    },
];

export default function RefundPolicyPage() {
    return (
        <main className="min-h-screen bg-background px-4 sm:px-6 lg:px-8 py-14 md:py-20">
            <div className="max-w-2xl mx-auto">
                <BackHome />

                <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground mb-3">
                    Refund Policy
                </h1>
                <p className="text-sm text-muted-foreground mb-10">
                    Last updated: January 1, 2025
                </p>

                <p className="text-sm text-muted-foreground leading-7 mb-10">
                    This policy outlines the conditions under which GreenStatesBD processes
                    refunds for platform fees and services. Please read carefully before
                    making any payment.
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
                        Refund requests:{" "}
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