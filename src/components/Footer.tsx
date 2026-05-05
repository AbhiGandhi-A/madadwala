import { Wrench, Phone, Mail, MapPin } from "lucide-react";

const links = {
  Services: ["Plumber", "Electrician", "Housekeeping", "AC Repair", "Carpenter", "Painter"],
  Company: ["About Us", "Careers", "Press", "Blog", "For Professionals"],
  Support: ["Help Center", "Privacy Policy", "Terms of Service", "Refund Policy", "Contact Us"],
};

const cities = ["Delhi NCR", "Mumbai", "Surat", "Bangalore", "Pune", "Hyderabad", "Chennai", "Jaipur"];

export default function Footer() {
  return (
    <footer className="bg-dark-900 text-white">
      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand column */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center">
                <Wrench className="w-5 h-5 text-white" strokeWidth={2.5} />
              </div>
              <span className="text-2xl font-bold" style={{ fontFamily: "var(--font-display)" }}>
                <span className="text-gradient-orange">Madad</span>wala
              </span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-xs">
              India ka sabse trusted local services platform. Plumber, Electrician, Cleaning – sab kuch ek jagah, ₹30 mein unlock.
            </p>

            {/* Contact info */}
            <div className="space-y-2.5">
              <a href="tel:+919999999999" className="flex items-center gap-2.5 text-gray-400 hover:text-amber-400 transition-colors text-sm">
                <Phone className="w-4 h-4" />
                +91 99999 99999
              </a>
              <a href="mailto:support@madadwala.in" className="flex items-center gap-2.5 text-gray-400 hover:text-amber-400 transition-colors text-sm">
                <Mail className="w-4 h-4" />
                support@madadwala.in
              </a>
              <div className="flex items-center gap-2.5 text-gray-400 text-sm">
                <MapPin className="w-4 h-4" />
                India – 500+ Cities
              </div>
            </div>

            {/* Social */}
            <div className="flex gap-3 mt-6">
              {[
                { label: "📘", name: "Facebook" },
                { label: "📷", name: "Instagram" },
                { label: "🐦", name: "Twitter" },
                { label: "▶️", name: "YouTube" },
              ].map((s) => (
                <a
                  key={s.name}
                  href="#"
                  aria-label={s.name}
                  className="w-10 h-10 bg-white/10 hover:bg-amber-500 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-110 text-lg"
                >
                  {s.label}
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(links).map(([title, items]) => (
            <div key={title}>
              <h4 className="font-bold text-white mb-4 text-sm uppercase tracking-wide">
                {title}
              </h4>
              <ul className="space-y-2.5">
                {items.map((item) => (
                  <li key={item}>
                    <a href="#" className="text-gray-400 hover:text-amber-400 transition-colors text-sm">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Cities */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <p className="text-gray-500 text-xs mb-3 uppercase tracking-wide">Hamare Cities</p>
          <div className="flex flex-wrap gap-2">
            {cities.map((city) => (
              <a
                key={city}
                href="#"
                className="text-gray-500 hover:text-amber-400 text-xs px-3 py-1 bg-white/5 rounded-full transition-colors"
              >
                {city}
              </a>
            ))}
            <span className="text-gray-600 text-xs px-3 py-1">+ 490 more...</span>
          </div>
        </div>

        {/* App download */}
        <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
          <button className="flex items-center gap-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white px-5 py-3 rounded-xl transition-all duration-200">
            <span className="text-2xl">🍎</span>
            <div className="text-left">
              <div className="text-white/60 text-xs">Download on the</div>
              <div className="font-bold text-sm">App Store</div>
            </div>
          </button>
          <button className="flex items-center gap-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white px-5 py-3 rounded-xl transition-all duration-200">
            <span className="text-2xl">🤖</span>
            <div className="text-left">
              <div className="text-white/60 text-xs">Get it on</div>
              <div className="font-bold text-sm">Google Play</div>
            </div>
          </button>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-gray-500 text-sm text-center sm:text-left">
            © 2025 Madadwala Technologies Pvt Ltd · Made with 🧡 in India
          </p>
          <div className="flex gap-4 text-xs text-gray-500">
            <a href="#" className="hover:text-amber-400 transition-colors">Privacy</a>
            <a href="#" className="hover:text-amber-400 transition-colors">Terms</a>
            <a href="#" className="hover:text-amber-400 transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
