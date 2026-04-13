"use client";

import Image from "next/image";

const Loader = () => {
  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-6">

        <div className="flex items-center gap-2">
          <Image src="/logo.png" alt="GreenStatesBD" width={32} height={32} unoptimized />
          <span className="text-lg font-semibold">GreenStatesBD</span>
        </div>

        <div className="relative h-12 w-12">
          <div className="absolute inset-0 rounded-full border-4 border-primary/20" />
          <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-primary border-r-secondary" />
        </div>

        <p className="text-xs uppercase tracking-[3px] text-muted-foreground">
          Loading
        </p>
      </div>
    </div>
  );
};

export default Loader;