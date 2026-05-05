"use client";

import { useRef, useEffect, useState } from "react";
import { ArrowRight, TrendingUp, Users, Wallet } from "lucide-react";

export default function ProCTA() {
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
    <section id="for-pros" className="py-20 bg-dark-800 relative overflow-hidden" ref={ref}>
      <div className="absolute inset-0 pattern-grid opacity-30" />
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-green-500/10 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div
            className={`transition-all duration-700 ${
              visible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"
            }`}
          >
            <span className="inline-block bg-amber-400/20 text-amber-400 text-sm font-semibold px-4 py-1.5 rounded-full mb-5">
              🔨 Professional registration
            </span>
            <h2
              className="text-3xl md:text-5xl font-bold text-white mb-5 leading-tight"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Grow your service business
              <br />
              <span className="text-gradient-orange">with verified leads</span>
            </h2>
            <p className="text-gray-400 text-lg mb-8 leading-relaxed">
              Join Madadwala to connect with customers in your city, manage requests easily, and build a trusted profile.
            </p>

            <div className="grid grid-cols-1 gap-4 mb-8">
              <div className="flex items-start gap-3 bg-white/5 border border-white/10 rounded-3xl p-4">
                <Wallet className="w-6 h-6 text-amber-400 mt-1" />
                <div>
                  <p className="text-white font-semibold">Transparent earnings</p>
                  <p className="text-gray-500 text-sm">Track every booking clearly in your pro dashboard.</p>
                </div>
              </div>
              <div className="flex items-start gap-3 bg-white/5 border border-white/10 rounded-3xl p-4">
                <Users className="w-6 h-6 text-blue-400 mt-1" />
                <div>
                  <p className="text-white font-semibold">Verified customer demand</p>
                  <p className="text-gray-500 text-sm">Receive requests from real users looking for local service help.</p>
                </div>
              </div>
              <div className="flex items-start gap-3 bg-white/5 border border-white/10 rounded-3xl p-4">
                <TrendingUp className="w-6 h-6 text-green-400 mt-1" />
                <div>
                  <p className="text-white font-semibold">Grow your reviews</p>
                  <p className="text-gray-500 text-sm">Build genuine ratings by completing more service requests.</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button className="flex items-center justify-center gap-2 bg-gradient-to-r from-amber-400 to-orange-500 text-white px-6 py-4 rounded-xl font-bold shadow-orange hover:scale-105 transition-transform duration-200">
                Register as Pro
                <ArrowRight className="w-5 h-5" />
              </button>
              <button className="flex items-center justify-center gap-2 border border-white/20 text-white px-6 py-4 rounded-xl font-semibold hover:bg-white/5 transition-colors">
                Learn more
              </button>
            </div>
          </div>

          <div
            className={`transition-all duration-700 delay-200 ${
              visible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"
            }`}
          >
            <div className="bg-white/5 backdrop-blur border border-white/10 rounded-3xl p-8">
              <div className="text-center mb-6">
                <div className="text-5xl mb-3">👨‍🔧</div>
                <h3 className="text-white font-bold text-xl" style={{ fontFamily: "var(--font-display)" }}>
                  Verified Pro Network
                </h3>
                <p className="text-gray-400 text-sm">A trusted community of local service professionals.</p>
              </div>

              <div className="bg-gradient-to-br from-amber-400/20 to-orange-500/10 border border-amber-400/20 rounded-2xl p-5 mb-4">
                <div className="text-gray-400 text-sm mb-1">Service requests managed</div>
                <div className="text-3xl font-black text-amber-400" style={{ fontFamily: "var(--font-display)" }}>
                  Live dashboard
                </div>
                <div className="flex items-center gap-1 mt-1 text-green-400 text-sm font-medium">
                  <TrendingUp className="w-4 h-4" />
                  Real requests in your area
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white/5 rounded-xl p-3 text-center">
                  <div className="text-white font-bold text-xl" style={{ fontFamily: "var(--font-display)" }}>
                    Live
                  </div>
                  <div className="text-gray-500 text-xs">Job status</div>
                </div>
                <div className="bg-white/5 rounded-xl p-3 text-center">
                  <div className="text-white font-bold text-xl" style={{ fontFamily: "var(--font-display)" }}>
                    Verified
                  </div>
                  <div className="text-gray-500 text-xs">Pros only</div>
                </div>
              </div>

              <div className="mt-4 text-center text-gray-500 text-xs italic">
                "Connect with customers and build on genuine service work."
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
