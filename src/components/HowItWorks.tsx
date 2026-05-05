"use client";

import { useRef, useEffect, useState } from "react";
import { Search, Unlock, PhoneCall } from "lucide-react";

const steps = [
  {
    num: "01",
    icon: Search,
    title: "Search Karo",
    desc: "Apna shehar aur service chunein. Nearby verified pros turant dikhenge.",
    color: "from-amber-400 to-orange-500",
    accent: "bg-amber-50 border-amber-200",
    highlight: "text-amber-600",
  },
  {
    num: "02",
    icon: Unlock,
    title: "₹30 Mein Unlock",
    desc: "Ek chhoti si fee se pro ka number unlock karo. Koi hidden charges nahi!",
    color: "from-blue-400 to-indigo-500",
    accent: "bg-blue-50 border-blue-200",
    highlight: "text-blue-600",
  },
  {
    num: "03",
    icon: PhoneCall,
    title: "Call Karo & Fix!",
    desc: "Seedha baat karo. Pro aapke paas aayega aur kaam ho jayega. Simple!",
    color: "from-green-400 to-emerald-500",
    accent: "bg-green-50 border-green-200",
    highlight: "text-green-600",
  },
];

export default function HowItWorks() {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.2 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="py-20 bg-gradient-to-b from-white to-amber-50/40" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div
          className={`text-center mb-14 transition-all duration-700 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <span className="inline-block bg-green-100 text-green-700 text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
            ⚡ 3 Aasaan Kadam
          </span>
          <h2
            className="text-3xl md:text-5xl font-bold text-gray-900 mb-4"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Itna{" "}
            <span className="text-gradient-orange">Aasaan</span> Hai!
          </h2>
          <p className="text-gray-500 text-lg">
            3 simple steps mein apna problem solve karo
          </p>
        </div>

        <div className="relative">
          {/* Connecting line (desktop) */}
          <div className="hidden md:block absolute top-20 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-amber-400 via-blue-400 to-green-400 opacity-30" />

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.num}
                  className={`relative transition-all duration-700 ${
                    visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                  }`}
                  style={{ transitionDelay: `${i * 150}ms` }}
                >
                  <div className={`${step.accent} border-2 rounded-2xl p-8 text-center hover:shadow-xl transition-all duration-300 group`}>
                    {/* Step number */}
                    <div className="text-6xl font-black text-gray-100 absolute -top-5 left-8 select-none" style={{ fontFamily: "var(--font-display)" }}>
                      {step.num}
                    </div>

                    {/* Icon */}
                    <div className={`relative z-10 w-16 h-16 bg-gradient-to-br ${step.color} rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                      <Icon className="w-8 h-8 text-white" strokeWidth={2} />
                    </div>

                    {/* Content */}
                    <h3
                      className={`text-xl font-bold ${step.highlight} mb-3`}
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      {step.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{step.desc}</p>

                    {/* Arrow to next step */}
                    {i < 2 && (
                      <div className="md:hidden mt-6 text-center text-2xl">↓</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Time highlight */}
        <div
          className={`mt-12 text-center transition-all duration-700 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
          style={{ transitionDelay: "500ms" }}
        >
          <div className="inline-flex items-center gap-3 bg-dark-800 text-white px-6 py-4 rounded-2xl shadow-xl">
            <span className="text-3xl">⏱️</span>
            <div className="text-left">
              <div className="font-bold text-lg" style={{ fontFamily: "var(--font-display)" }}>
                Average{" "}
                <span className="text-amber-400">15 Minutes</span> Mein Pro Aapke Ghar!
              </div>
              <div className="text-white/60 text-sm">50,000+ successful service calls</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
