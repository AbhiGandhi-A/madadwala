"use client";

import { useState, useEffect, useRef } from "react";
import { Search, ChevronDown, Phone, Play, MapPin } from "lucide-react";

const services = [
  { value: "plumber", label: "Plumber" },
  { value: "electrician", label: "Electrician" },
  { value: "cleaning", label: "Housekeeping" },
  { value: "ac", label: "AC Repair" },
  { value: "carpenter", label: "Carpenter" },
  { value: "painting", label: "Painting" },
  { value: "security", label: "Security" },
  { value: "pest", label: "Pest Control" },
];

const cities = ["Mumbai", "Delhi", "Bangalore", "Chennai", "Hyderabad", "Pune"];

const floatingIcons = [
  { emoji: "🔧", top: "15%", left: "5%", delay: "0s", className: "float-1" },
  { emoji: "⚡", top: "25%", right: "8%", delay: "1s", className: "float-2" },
  { emoji: "🚿", top: "60%", left: "3%", delay: "2s", className: "float-3" },
  { emoji: "❄️", top: "70%", right: "5%", delay: "0.5s", className: "float-1" },
  { emoji: "🪚", top: "40%", left: "8%", delay: "1.5s", className: "float-2" },
  { emoji: "🧹", top: "50%", right: "10%", delay: "2.5s", className: "float-3" },
];

function FeatureBadge({ label, delay }: { label: string; delay: string }) {
  return (
    <div
      className="glass rounded-2xl px-4 py-3 text-center min-w-[140px]"
      style={{ animationDelay: delay }}
    >
      <div className="text-sm font-semibold text-white" style={{ fontFamily: "var(--font-display)" }}>
        {label}
      </div>
    </div>
  );
}

export default function Hero() {
  const [selectedCity, setSelectedCity] = useState("Auto GPS");
  const [selectedService, setSelectedService] = useState("plumber");
  const [cityOpen, setCityOpen] = useState(false);
  const [serviceOpen, setServiceOpen] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  const currentService = services.find((s) => s.value === selectedService);

  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden hero-bg pattern-dots">
      {/* Background decorative circles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-amber-400/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-orange-600/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-500/5 rounded-full blur-3xl" />
      </div>

      {/* Floating emoji icons */}
      <div className="absolute inset-0 pointer-events-none hidden lg:block">
        {floatingIcons.map((icon, i) => (
          <div
            key={i}
            className={`absolute text-4xl opacity-20 ${icon.className}`}
            style={{
              top: icon.top,
              left: icon.left,
              right: icon.right,
            }}
          >
            {icon.emoji}
          </div>
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-24 pb-16">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div
            className={`inline-flex items-center gap-2 glass text-white/90 px-4 py-2 rounded-full text-sm font-medium mb-6 transition-all duration-700 ${
              visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
            style={{ transitionDelay: "0ms" }}
          >
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            India&apos;s Fastest Growing Local Services App 🇮🇳
          </div>

          {/* H1 */}
          <h1
            className={`font-bold leading-tight mb-4 transition-all duration-700 ${
              visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2.2rem, 6vw, 4.5rem)",
              transitionDelay: "100ms",
            }}
          >
            <span className="text-gradient-orange">Ek Call Mein</span>{" "}
            <span className="relative inline-block">
              <span className="text-gradient-orange">Madad!</span>
              <span className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full opacity-60" />
            </span>
          </h1>

          {/* H2 */}
          <p
            className={`text-white/80 text-lg md:text-xl mb-8 leading-relaxed transition-all duration-700 ${
              visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
            style={{ transitionDelay: "200ms" }}
          >
            Reliable home services across major cities in India.
            <br className="hidden sm:block" />
            <span className="text-amber-300 font-medium">
              {" "}Book local pros for plumbing, electrical, cleaning, and more.
            </span>
          </p>

          {/* Search Box */}
          <div
            className={`glass rounded-2xl p-3 md:p-4 mb-8 mx-auto max-w-3xl transition-all duration-700 ${
              visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
            style={{ transitionDelay: "300ms" }}
          >
            <div className="flex flex-col sm:flex-row gap-3">
              {/* City selector */}
              <div className="relative flex-1 min-w-0">
                <button
                  onClick={() => { setCityOpen(!cityOpen); setServiceOpen(false); }}
                  className="w-full flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white px-4 py-3.5 rounded-xl text-left transition-colors font-medium"
                >
                  <MapPin className="w-4 h-4 text-amber-300 flex-shrink-0" />
                  <span className="flex-1 truncate">{selectedCity}</span>
                  <ChevronDown className={`w-4 h-4 transition-transform flex-shrink-0 ${cityOpen ? "rotate-180" : ""}`} />
                </button>
                {cityOpen && (
                  <div className="absolute top-full left-0 mt-2 w-full bg-white rounded-xl shadow-2xl overflow-hidden z-50">
                    {cities.map((city) => (
                      <button
                        key={city}
                        onClick={() => { setSelectedCity(city); setCityOpen(false); }}
                        className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-amber-50 hover:text-amber-700 transition-colors"
                      >
                        {city === "Auto GPS" ? "📍 " : "🏙️ "}{city}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Service selector */}
              <div className="relative flex-1 min-w-0">
                <button
                  onClick={() => { setServiceOpen(!serviceOpen); setCityOpen(false); }}
                  className="w-full flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white px-4 py-3.5 rounded-xl text-left transition-colors font-medium"
                >
                  <span className="flex-1">{currentService?.label}</span>
                  <ChevronDown className={`w-4 h-4 transition-transform flex-shrink-0 ${serviceOpen ? "rotate-180" : ""}`} />
                </button>
                {serviceOpen && (
                  <div className="absolute top-full left-0 mt-2 w-full bg-white rounded-xl shadow-2xl overflow-hidden z-50">
                    {services.map((service) => (
                      <button
                        key={service.value}
                        onClick={() => { setSelectedService(service.value); setServiceOpen(false); }}
                        className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-amber-50 hover:text-amber-700 transition-colors"
                      >
                        {service.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Search button */}
              <button className="flex items-center justify-center gap-2 bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-white px-6 py-3.5 rounded-xl font-bold shadow-orange hover:shadow-xl hover:scale-105 transition-all duration-200 whitespace-nowrap">
                <Search className="w-5 h-5" />
                <span>Dhundho!</span>
              </button>
            </div>
          </div>

          {/* CTA Buttons */}
          <div
            className={`flex flex-col sm:flex-row gap-4 justify-center mb-10 transition-all duration-700 ${
              visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
            style={{ transitionDelay: "400ms" }}
          >
            <button className="relative group flex items-center justify-center gap-3 btn-shimmer text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-green hover:scale-105 transition-transform duration-200">
              <div className="absolute inset-0 rounded-2xl bg-green-400/30 ping-slow" />
              <Phone className="w-6 h-6" />
              OTP 30sec Mein Login – FREE
            </button>
            <button className="flex items-center justify-center gap-3 glass text-white border border-white/30 px-8 py-4 rounded-2xl font-semibold text-lg hover:bg-white/20 transition-all duration-200">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <Play className="w-4 h-4 fill-white text-white ml-0.5" />
              </div>
              Kaise Kaam Karta?
            </button>
          </div>

          {/* Trust badges */}
          <div
            className={`flex flex-wrap justify-center gap-3 mb-10 transition-all duration-700 ${
              visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
            style={{ transitionDelay: "500ms" }}
          >
            {[
              "✅ Verified Pros",
              "🔒 Secure OTP Login",
              "⭐ 4.8/5 Rating",
              "🕐 24/7 Available",
            ].map((badge) => (
              <span
                key={badge}
                className="glass text-white/90 text-sm px-3 py-1.5 rounded-full"
              >
                {badge}
              </span>
            ))}
          </div>

          {/* Stats */}
          <div
            className={`flex flex-wrap justify-center gap-4 transition-all duration-700 ${
              visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
            style={{ transitionDelay: "600ms" }}
          >
            {[
              "Verified Professionals",
              "Fast Local Support",
              "Nationwide Coverage",
              "24/7 Service",
            ].map((badge, index) => (
              <FeatureBadge key={badge} label={badge} delay={`${index * 100}ms`} />
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="flex justify-center mt-12">
          <div className="flex flex-col items-center gap-2 text-white/50">
            <span className="text-xs">Neeche Dekho</span>
            <div className="w-6 h-10 border-2 border-white/20 rounded-full flex justify-center pt-2">
              <div className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-bounce" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
