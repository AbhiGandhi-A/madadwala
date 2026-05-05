"use client";

export default function Testimonials() {
  return (
    <section className="py-20 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-12">
        <div className="text-center">
          <span className="inline-block bg-amber-100 text-amber-700 text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
            💬 Customer feedback
          </span>
          <h2
            className="text-3xl md:text-5xl font-bold text-gray-900 mb-4"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Genuine reviews only
          </h2>
          <p className="text-gray-500 text-lg">
            We collect real customer testimonials and display them once they are verified.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="rounded-3xl border border-gray-200 bg-gray-50 p-12 text-center">
          <p className="text-gray-700 text-xl font-semibold">
            Testimonials will appear here when authentic customer feedback is available.
          </p>
          <p className="text-gray-500 text-sm mt-4">
            No placeholder reviews. Only real customer experiences get displayed.
          </p>
        </div>
      </div>
    </section>
  );
}
