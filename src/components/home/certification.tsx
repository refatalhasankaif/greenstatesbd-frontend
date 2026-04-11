"use client";

import Image from "next/image";
import React from "react";

const Certification = () => {
    return (
        <section
            id="certification"
            className="w-full py-25 md:py-45 lg:py-60 px-4 sm:px-6 lg:px-8"
        >
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col md:flex-col lg:flex-row sm:flex-row items-center sm:items-start gap-8 md:gap-10 lg:gap-14">
                    <div className="shrink-0 flex items-start justify-center w-full sm:w-auto">
                        <div className="relative w-36 h-36 sm:w-40 sm:h-40 md:w-48 md:h-48 lg:w-56 lg:h-56">
                            <Image
                                src="/bd-gov.png"
                                alt="Bangladesh Government Certification"
                                fill
                                className="object-contain drop-shadow-md"
                                priority
                            />
                        </div>
                    </div>
                    <div className="flex-1 text-center sm:text-left">
                        <h2 className="text-2xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold leading-tight tracking-tight">
                            Government Certified & Trusted
                        </h2>
                        <div className="mt-1 mb-5 w-14 h-1 rounded-full bg-primary mx-auto sm:mx-0" />
                        <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
                            GreenStatesBD operates under strict Bangladesh government property verification
                            standards, ensuring that every listing is legally verified, authentic, and fully transparent.
                            Our platform actively detects and removes fraudulent listings while verifying ownership
                            through a structured validation process — protecting both buyers and sellers.
                            From property listing to final handover, each step is monitored and assisted by our
                            management team — giving users complete confidence, safety, and trust in every transaction.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Certification;