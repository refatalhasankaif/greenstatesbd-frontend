import AIBaseChat from "@/components/ai/AIBaseChat";

export default function Page() {
    return (
        <AIBaseChat
            endpoint="/ai/chat"
            title="GreenStatesBD AI"
            subtitle="Ask about property, land buying, investment, or real estate in Bangladesh"
            suggestions={[
                "How to buy land in Bangladesh?",
                "What is property bidding?",
                "Is real estate a good investment?",
                "What documents are required to buy land?",
            ]}
        />
    );
}