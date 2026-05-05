"use client";

import { useRef, useEffect, useState } from "react";

const categories = [
  { icon: "🚿", name: "Plumber", pros: "2,400+", color: "from-blue-400 to-cyan-500", bg: "bg-blue-50", border: "border-blue-100" },
  { icon: "⚡", name: "Electrician", pros: "1,800+", color: "from-yellow-400 to-amber-500", bg: "bg-yellow-50", border: "border-yellow-100" },
  { icon: "🧹", name: "Housekeeping", pros: "3,200+", color: "from-green-400 to-emerald-500", bg: "bg-green-50", border: "border-green-100" },
  { icon: "❄️", name: "AC Repair", pros: "900+", color: "from-sky-400 to-blue-500", bg: "bg-sky-50", border: "border-sky-100" },
  { icon: "🪚", name: "Carpenter", pros: "700+", color: "from-orange-400 to-red-400", bg: "bg-orange-50", border: "border-orange-100" },
  { icon: "🖌️", name: "Painter", pros: "600+", color: "from-purple-400 to-violet-500", bg: "bg-purple-50", border: "border-purple-100" },
  { icon: "🛡️", name: "Security", pros: "400+", color: "from-slate-500 to-gray-600", bg: "bg-slate-50", border: "border-slate-100" },
  { icon: "🐛", name: "Pest Control", pros: "350+", color: "from-lime-500 to-green-600", bg: "bg-lime-50", border: "border-lime-100" },
  { icon: "🚗", name: "Car Wash", pros: "500+", color: "from-red-400 to-rose-500", bg: "bg-red-50", border: "border-red-100" },
  { icon: "🔑", name: "Locksmith", pros: "280+", color: "from-zinc-400 to-gray-500", bg: "bg-zinc-50", border: "border-zinc-100" },
  { icon: "📦", name: "Packers", pros: "220+", color: "from-amber-500 to-yellow-600", bg: "bg-amber-50", border: "border-amber-100" },
  { icon: "🌿", name: "Gardening", pros: "180+", color: "from-emerald-400 to-green-500", bg: "bg-emerald-50", border: "border-emerald-100" },
];

function CategoryCard({ cat, index }: { cat: typeof categories[0]; index: number }) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`group cursor-pointer transition-all duration-500 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
      style={{ transitionDelay: `${(index % 4) * 75}ms` }}
    >
      <div
        className={`${cat.bg} ${cat.border} border-2 rounded-2xl p-5 text-center card-hover hover:border-amber-300 relative overflow-hidden`}
      >
        {/* Gradient overlay on hover */}
        <div className={`absolute inset-0 bg-gradient-to-br ${cat.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300 rounded-2xl`} />

        {/* Icon */}
        <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">
          {cat.icon}
        </div>

        {/* Name */}
        <h3 className="font-bold text-gray-800 text-sm mb-1" style={{ fontFamily: "var(--font-display)" }}>
          {cat.name}
        </h3>

        {/* Badge */}
        <div className={`inline-flex items-center gap-1 bg-gradient-to-r ${cat.color} text-white text-xs px-2.5 py-1 rounded-full font-medium shadow-sm`}>
          <span className="w-1.5 h-1.5 bg-white rounded-full opacity-80" />
          {cat.pros} Pros
        </div>

        {/* Hover arrow */}
        <div className="absolute top-3 right-3 w-6 h-6 bg-amber-400 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:scale-100 scale-50">
          <span className="text-white text-xs">→</span>
        </div>
      </div>
    </div>
  );
}

export default function Categories() {
  const [titleVisible, setTitleVisible] = useState(false);
  const titleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setTitleVisible(true); },
      { threshold: 0.3 }
    );
    if (titleRef.current) observer.observe(titleRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="services" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section header */}
        <div
          ref={titleRef}
          className={`text-center mb-12 transition-all duration-700 ${
            titleVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <span className="inline-block bg-amber-100 text-amber-700 text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
            🛠️ Hamare Services
          </span>
          <h2
            className="text-3xl md:text-5xl font-bold text-gray-900 mb-4"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Kya Chahiye{" "}
            <span className="text-gradient-orange">Aapko?</span>
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            12+ categories mein 10,000+ verified professionals – apna problem chunein
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {categories.map((cat, i) => (
            <CategoryCard key={cat.name} cat={cat} index={i} />
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-10">
          <button className="inline-flex items-center gap-2 border-2 border-amber-400 text-amber-600 hover:bg-amber-400 hover:text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200">
            Saare Services Dekho →
          </button>
        </div>
      </div>
    </section>
  );
}
