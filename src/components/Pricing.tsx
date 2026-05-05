"use client";

import { useRef, useEffect, useState } from "react";
import { Check, Zap } from "lucide-react";

export default function Pricing() {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.2 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="pricing" className="py-20 bg-gradient-to-b from-amber-50/40 to-white" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div
          className={`text-center mb-14 transition-all duration-700 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <span className="inline-block bg-blue-100 text-blue-700 text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
            💰 Transparent pricing
          </span>
          <h2
            className="text-3xl md:text-5xl font-bold text-gray-900 mb-4"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Real rates for real services
          </h2>
          <p className="text-gray-500 text-lg">
            Service costs are shown after you select the local pro and confirm your request.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <div
            className={`relative bg-white border border-gray-200 rounded-2xl p-7 transition-all duration-700 hover:shadow-lg ${
              visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
            style={{ transitionDelay: "0ms" }}
          >
            <div className="text-4xl mb-4">📝</div>
            <h3 className="text-xl font-bold text-gray-900 mb-3" style={{ fontFamily: "var(--font-display)" }}>
              Select the service
            </h3>
            <p className="text-gray-500 text-sm leading-relaxed mb-6">
              Choose your local service, confirm the request, and see live pricing from verified professionals.
            </p>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-gray-700 text-sm">
                <Check className="w-4 h-4 text-amber-500 mt-1" />
                Transparent service quotes
              </li>
              <li className="flex items-start gap-3 text-gray-700 text-sm">
                <Check className="w-4 h-4 text-amber-500 mt-1" />
                No hidden subscription fee
              </li>
            </ul>
          </div>

          <div
            className={`relative bg-white border border-gray-200 rounded-2xl p-7 transition-all duration-700 hover:shadow-lg ${
              visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
            style={{ transitionDelay: "120ms" }}
          >
            <div className="text-4xl mb-4">🔓</div>
            <h3 className="text-xl font-bold text-gray-900 mb-3" style={{ fontFamily: "var(--font-display)" }}>
              Unlock contact details
            </h3>
            <p className="text-gray-500 text-sm leading-relaxed mb-6">
              Once you choose a pro, contact details are revealed for a secure, direct connection.
            </p>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-gray-700 text-sm">
                <Check className="w-4 h-4 text-amber-500 mt-1" />
                Verified local professionals
              </li>
              <li className="flex items-start gap-3 text-gray-700 text-sm">
                <Check className="w-4 h-4 text-amber-500 mt-1" />
                Contact only after confirmation
              </li>
            </ul>
          </div>

          <div
            className={`relative bg-white border border-gray-200 rounded-2xl p-7 transition-all duration-700 hover:shadow-lg ${
              visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
            style={{ transitionDelay: "240ms" }}
          >
            <div className="text-4xl mb-4">💳</div>
            <h3 className="text-xl font-bold text-gray-900 mb-3" style={{ fontFamily: "var(--font-display)" }}>
              Pay only for the service
            </h3>
            <p className="text-gray-500 text-sm leading-relaxed mb-6">
              Pricing is based on the confirmed quote from your selected pro, not on generic package claims.
            </p>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-gray-700 text-sm">
                <Check className="w-4 h-4 text-amber-500 mt-1" />
                Secure payments supported
              </li>
              <li className="flex items-start gap-3 text-gray-700 text-sm">
                <Check className="w-4 h-4 text-amber-500 mt-1" />
                Clear, honest pricing
              </li>
            </ul>
          </div>
        </div>

        <div className="text-center mt-8 text-gray-500 text-sm flex items-center justify-center gap-2">
          <Zap className="w-4 h-4 text-amber-400" />
          No hidden charges · Confirm your quote before booking · Live service pricing
        </div>
      </div>
    </section>
  );
}
