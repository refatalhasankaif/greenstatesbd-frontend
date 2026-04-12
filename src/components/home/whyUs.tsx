"use client";

import React from "react";
import {
  ShieldCheck,
  Users,
  Headphones,
  Video,
  Flag,
  Handshake,
} from "lucide-react";

const features = [
  {
    icon: <ShieldCheck size={28} />,
    title: "Government Verified Properties",
    desc: "All listings go through strict verification to ensure legal safety and authenticity.",
  },
  {
    icon: <Users size={28} />,
    title: "Role-Based Management System",
    desc: "Managed by admins, managers, and moderators for maximum transparency and control.",
  },
  {
    icon: <Headphones size={28} />,
    title: "24/7 Dedicated Support",
    desc: "Our support team is always available to assist you anytime, anywhere.",
  },
  {
    icon: <Video size={28} />,
    title: "Live Property Sessions",
    desc: "Join real-time video sessions to explore properties remotely with our agents.",
  },
  {
    icon: <Flag size={28} />,
    title: "Report Fake Listings",
    desc: "Easily report suspicious properties and help keep the platform safe for everyone.",
  },
  {
    icon: <Handshake size={28} />,
    title: "Manager-Assisted Handover",
    desc: "Our managers ensure smooth and secure property handover from start to finish.",
  },
];

const whyUs = () => {
  return (
    <section id="why-trust-us" className="w-full py-25 md:py-45 lg:py-60 px-4 bg-muted/30">

      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            Why Trust GreenStatesBD
          </h2>
          <p className="text-muted-foreground mt-4 text-sm md:text-base">
            We ensure a secure, transparent, and seamless real estate experience with powerful tools and trusted processes.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

          {features.map((item, i) => (
            <div
              key={i}
              className="group p-6 rounded-xl border bg-background hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer"
            >

              <div className="mb-4 w-12 h-12 flex items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:scale-110 transition">
                {item.icon}
              </div>
              <h3 className="font-bold text-lg mb-2">
                {item.title}
              </h3>

              {/* DESC */}
              <p className="text-sm text-muted-foreground leading-relaxed">
                {item.desc}
              </p>

            </div>
          ))}

        </div>
      </div>
    </section>
  );
};

export default whyUs;