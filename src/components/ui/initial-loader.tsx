"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Loader from "./loader";

export default function InitialLoader({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const [loading, setLoading] = useState(pathname === "/");

  useEffect(() => {
    if (pathname !== "/") return;

    const timer = setTimeout(() => {
      setLoading(false);
    }, 1600);

    return () => clearTimeout(timer);
  }, [pathname]);

  if (pathname === "/" && loading) {
    return <Loader />;
  }

  return <>{children}</>;
}