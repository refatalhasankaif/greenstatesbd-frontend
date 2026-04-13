

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function NotFoundPage() {
    return (
        <div className="flex min-h-[80vh] flex-col items-center justify-center px-4 text-center">

            <Image
                src="/logo.png"
                alt="GreenStatesBD"
                width={64}
                height={64}
                className="mb-6"
                priority
                unoptimized
            />

            <h1 className="text-5xl font-bold tracking-tight">404</h1>

            <p className="mt-4 max-w-md text-muted-foreground">
                The page you are looking for does not exist or may have been moved.
            </p>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
                <Button asChild>
                    <Link href="/">Back to Home</Link>
                </Button>

                <Button variant="outline" asChild>
                    <Link href="/properties">Explore Properties</Link>
                </Button>
            </div>

        </div>
    );
}