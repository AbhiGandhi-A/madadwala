"use client";

import { useState, useEffect } from "react";
import { Wrench, MapPin, Phone, Menu, X, ChevronDown } from "lucide-react";
import Link from "next/link";

const cities = [
  { value: "auto", label: "📍 Auto GPS" },
  { value: "delhi", label: "Delhi NCR" },
  { value: "mumbai", label: "Mumbai" },
  { value: "surat", label: "Surat" },
  { value: "bangalore", label: "Bangalore" },
  { value: "pune", label: "Pune" },
  { value: "hyderabad", label: "Hyderabad" },
  { value: "chennai", label: "Chennai" },
  { value: "jaipur", label: "Jaipur" },
  { value: "ahmedabad", label: "Ahmedabad" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState("auto");
  const [cityDropdown, setCityDropdown] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const currentCity = cities.find((c) => c.value === selectedCity);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/95 backdrop-blur-md shadow-lg border-b border-amber-100"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16 md:h-18">
            {/* Logo */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <div className="w-9 h-9 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center shadow-orange">
                <Wrench className="w-5 h-5 text-white" strokeWidth={2.5} />
              </div>
              <div className="flex flex-col leading-none">
                <span
                  className="text-xl font-bold text-dark-800"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  <span className="text-gradient-orange">Madad</span>wala
                </span>
                <span className="text-[10px] text-gray-500 -mt-0.5">
                  Ek Call Mein Madad
                </span>
              </div>
            </div>

            {/* Desktop center: City selector */}
            <div className="hidden md:flex items-center gap-4">
              {/* City dropdown */}
              <div className="relative">
                <button
                  onClick={() => setCityDropdown(!cityDropdown)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium transition-all ${
                    scrolled
                      ? "border-amber-200 text-gray-700 bg-amber-50 hover:bg-amber-100"
                      : "border-white/30 text-white bg-white/10 hover:bg-white/20"
                  }`}
                >
                  <MapPin className="w-4 h-4 text-amber-500" />
                  {currentCity?.label}
                  <ChevronDown className={`w-4 h-4 transition-transform ${cityDropdown ? "rotate-180" : ""}`} />
                </button>
                {cityDropdown && (
                  <div className="absolute top-full left-0 mt-2 w-52 bg-white rounded-xl shadow-xl border border-amber-100 overflow-hidden z-50">
                    {cities.map((city) => (
                      <button
                        key={city.value}
                        onClick={() => {
                          setSelectedCity(city.value);
                          setCityDropdown(false);
                        }}
                        className={`w-full text-left px-4 py-2.5 text-sm hover:bg-amber-50 transition-colors ${
                          selectedCity === city.value
                            ? "bg-amber-50 text-amber-600 font-medium"
                            : "text-gray-700"
                        }`}
                      >
                        {city.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Nav links */}
              {["Services", "Pricing", "For Pros"].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase().replace(" ", "-")}`}
                  className={`text-sm font-medium transition-colors hover:text-amber-500 ${
                    scrolled ? "text-gray-600" : "text-white/80"
                  }`}
                >
                  {item}
                </a>
              ))}
            </div>

            {/* CTA + Mobile toggle */}
            <div className="flex items-center gap-3">
              <Link href="/login">
                <button className="hidden md:flex items-center gap-2 bg-gradient-to-r from-amber-400 to-orange-500 text-white px-5 py-2.5 rounded-xl font-semibold text-sm shadow-orange hover:shadow-xl hover:scale-105 transition-all duration-200">
                  <Phone className="w-4 h-4" />
                  OTP Karo
                </button>
              </Link>
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className={`md:hidden p-2 rounded-lg ${
                  scrolled ? "text-gray-700" : "text-white"
                }`}
              >
                {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden bg-white border-t border-amber-100 shadow-xl">
            <div className="px-4 py-4 space-y-3">
              {/* City selector mobile */}
              <div className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-2">
                Apna Shehar Chunein
              </div>
              <div className="grid grid-cols-2 gap-2">
                {cities.slice(0, 6).map((city) => (
                  <button
                    key={city.value}
                    onClick={() => {
                      setSelectedCity(city.value);
                      setMobileOpen(false);
                    }}
                    className={`text-left px-3 py-2 rounded-lg text-sm transition-all ${
                      selectedCity === city.value
                        ? "bg-amber-100 text-amber-700 font-medium"
                        : "bg-gray-50 text-gray-700"
                    }`}
                  >
                    {city.label}
                  </button>
                ))}
              </div>
              <div className="pt-2 border-t border-gray-100">
                {["Services", "Pricing", "For Pros"].map((item) => (
                  <a
                    key={item}
                    href={`#${item.toLowerCase().replace(" ", "-")}`}
                    onClick={() => setMobileOpen(false)}
                    className="block py-2.5 text-gray-700 font-medium hover:text-amber-500 transition-colors"
                  >
                    {item}
                  </a>
                ))}
              </div>
              <button className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-amber-400 to-orange-500 text-white px-5 py-3 rounded-xl font-bold shadow-orange">
                <Phone className="w-5 h-5" />
                OTP Se Login Karo – Free!
              </button>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
