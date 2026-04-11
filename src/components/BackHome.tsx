import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const BackHome = () => (
    <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer mb-10"
    >
        <ArrowLeft size={15} strokeWidth={1.75} />
        Back to Home
    </Link>
);

export default BackHome;