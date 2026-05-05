"use client";

import { Home, Search, Phone, User } from "lucide-react";
import { useState } from "react";

const navItems = [
  { icon: Home, label: "Home", href: "#" },
  { icon: Search, label: "Search", href: "#services" },
  { icon: Phone, label: "OTP Login", href: "#", highlight: true },
  { icon: User, label: "Profile", href: "#" },
];

export default function MobileBottomNav() {
  const [active, setActive] = useState(0);

  return (
    <nav className="md:hidden mobile-bottom-nav shadow-xl z-50">
      <div className="flex justify-around">
        {navItems.map((item, i) => {
          const Icon = item.icon;
          return (
            <a
              key={item.label}
              href={item.href}
              onClick={() => setActive(i)}
              className={`flex flex-col items-center gap-1 px-4 py-2 transition-all duration-200 ${
                item.highlight
                  ? "relative"
                  : active === i
                  ? "text-amber-500"
                  : "text-gray-400"
              }`}
            >
              {item.highlight ? (
                <div className="absolute -top-5 w-14 h-14 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center shadow-orange">
                  <Icon className="w-6 h-6 text-white" />
                </div>
              ) : (
                <Icon className="w-5 h-5" strokeWidth={active === i ? 2.5 : 1.5} />
              )}
              <span className={`text-[10px] font-medium ${item.highlight ? "mt-8 text-amber-500" : ""}`}>
                {item.label}
              </span>
            </a>
          );
        })}
      </div>
    </nav>
  );
}
