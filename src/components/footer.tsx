import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-10">

        <div className="grid gap-8 md:grid-cols-3">

          {/* Brand */}
          <div>
            <h3 className="text-lg font-semibold">GreenStatesBD</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              A modern real estate bidding platform with AI-powered features and real-time communication.
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-col gap-2 text-sm">
            <Link href="/properties">Properties</Link>
            <Link href="/blogs">Blogs</Link>
            <Link href="/gallery">Gallery</Link>
            <Link href="/support">Support</Link>
          </div>

          {/* Legal */}
          <div className="flex flex-col gap-2 text-sm">
            <Link href="/privacy">Privacy Policy</Link>
            <Link href="/terms">Terms & Conditions</Link>
            <Link href="/contact">Contact</Link>
          </div>

        </div>

        <div className="mt-8 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} GreenStatesBD. All rights reserved.
        </div>

      </div>
    </footer>
  );
}