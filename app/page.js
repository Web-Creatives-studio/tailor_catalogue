"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  FaShirt,
  FaWhatsapp,
  FaQrcode,
  FaHandSparkles,
  FaArrowRight,
  FaRulerCombined,
  FaFileInvoiceDollar,
  FaCalendarCheck,
  FaCheck,
  FaChevronDown,
  FaShieldHalved,
  FaMobileScreenButton,
} from "react-icons/fa6";

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqs = [
    {
      q: "How does the WhatsApp order integration work?",
      a: "When a potential client views your digital storefront link, they can click 'Order via WhatsApp'. This instantly opens a WhatsApp chat with your business phone number, pre-filling the exact outfit title, image link, and pricing so you can close the sale immediately without repetitive back-and-forth typing.",
    },
    {
      q: "Can I manage my clients' body measurements on my smartphone?",
      a: "Yes! StyleThread is designed mobile-first. You can create customer profiles, record categorized sizing parameters (e.g., Senator, Agbada, Suits, Gowns), and access them in seconds directly from your workshop on any mobile device.",
    },
    {
      q: "How do PDF Invoices and Payment Receipts work?",
      a: "From any client profile, you can generate a professional branded PDF invoice or deposit receipt in one tap. You can download the PDF or send a formatted payment summary link directly to your client via WhatsApp.",
    },
    {
      q: "Is my clients' data secure?",
      a: "Absolutely. All client records, measurements, and design details are encrypted and securely stored in our cloud infrastructure powered by Neon Database. Only you and authorized workshop staff can access your account.",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      
      {/* Navigation */}
      <nav className="border-b border-slate-200/80 bg-white/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="bg-[#128C7E] text-white p-2 rounded-xl shadow-xs">
              <FaShirt className="h-5 w-5" />
            </div>
            <span className="font-extrabold text-xl tracking-tight text-slate-900">
              Style<span className="text-[#25D366]">Thread</span>
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-xs font-bold text-slate-600">
            <a href="#features" className="hover:text-[#128C7E] transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-[#128C7E] transition-colors">How It Works</a>
            <a href="#pricing" className="hover:text-[#128C7E] transition-colors">Pricing</a>
            <a href="#faq" className="hover:text-[#128C7E] transition-colors">FAQ</a>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-xs font-bold text-slate-700 hover:text-slate-900 transition-colors px-3 py-2"
            >
              Log in
            </Link>
            <Link
              href="/register"
              className="text-xs font-bold bg-[#128C7E] hover:bg-[#0e6d62] text-white px-4 py-2.5 rounded-xl transition-all shadow-md active:scale-95"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative max-w-5xl mx-auto px-4 pt-20 pb-16 text-center">
        <div className="inline-flex items-center gap-2 bg-emerald-50 text-[#128C7E] border border-emerald-100 px-3.5 py-1.5 rounded-full text-xs font-extrabold mb-6 shadow-2xs">
          <FaHandSparkles className="h-3.5 w-3.5 text-[#25D366]" /> The All-In-One OS for Bespoke Tailors & Fashion Houses
        </div>

        <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight leading-[1.15] mb-6">
          Store Client Measurements.<br />
          <span className="text-[#128C7E]">Close Bespoke Orders on WhatsApp.</span>
        </h1>

        <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto mb-8 leading-relaxed font-medium">
          Ditch lost paper notebooks and scattered WhatsApp chats. Manage your client sizing profiles, showcase design catalogues, issue PDF invoices, and schedule fitting reminders—all in one place.
        </p>

        <div className="flex flex-col sm:flex-row gap-3.5 justify-center">
          <Link
            href="/register"
            className="inline-flex items-center justify-center gap-2 bg-[#128C7E] hover:bg-[#0e6d62] text-white font-bold px-8 py-3.5 rounded-2xl text-sm transition-all shadow-xl shadow-[#128C7E]/20 active:scale-95"
          >
            Create Your Digital Studio <FaArrowRight className="h-4 w-4" />
          </Link>
          <a
            href="#features"
            className="inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-100 text-slate-700 font-bold px-6 py-3.5 rounded-2xl text-sm border border-slate-200 transition-colors"
          >
            Explore Platform Features
          </a>
        </div>

        {/* Feature Badges */}
        <div className="mt-12 pt-8 border-t border-slate-200/60 grid grid-cols-2 sm:grid-cols-4 gap-4 text-left max-w-3xl mx-auto">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
            <FaCheck className="text-[#25D366]" /> Zero App Downloads Required
          </div>
          <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
            <FaCheck className="text-[#25D366]" /> Works on iOS & Android
          </div>
          <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
            <FaCheck className="text-[#25D366]" /> Unlimited Measurement Storage
          </div>
          <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
            <FaCheck className="text-[#25D366]" /> 1-Click WhatsApp Invoicing
          </div>
        </div>
      </section>

      {/* Deep Dive Features Section */}
      <section id="features" className="max-w-6xl mx-auto px-4 py-20 border-t border-slate-200">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Built for How Fashion Businesses Actually Work
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-2">
            Every feature is designed to save you hours of admin work, eliminate fabric mix-ups, and impress your high-value clients.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="bg-white p-7 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-emerald-50 text-[#128C7E] rounded-2xl flex items-center justify-center mb-5 border border-emerald-100">
              <FaRulerCombined className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Categorized Fit Records</h3>
            <p className="text-slate-600 text-xs leading-relaxed">
              Store precise fit parameters by category—Senator, Agbada, Corporate Suit, Shirt, Trouser, or Streetwear. Never search for a client's notebook again.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white p-7 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-emerald-50 text-[#25D366] rounded-2xl flex items-center justify-center mb-5 border border-emerald-100">
              <FaWhatsapp className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Instant WhatsApp Orders</h3>
            <p className="text-slate-600 text-xs leading-relaxed">
              Share a clean link (`/t/your-brand`). Clients browse your catalogue and click one button to open WhatsApp with pre-filled outfit details.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white p-7 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-emerald-50 text-[#128C7E] rounded-2xl flex items-center justify-center mb-5 border border-emerald-100">
              <FaFileInvoiceDollar className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">PDF Invoices & Receipts</h3>
            <p className="text-slate-600 text-xs leading-relaxed">
              Generate branded deposit invoices and payment receipts in seconds. Share PDF files directly to WhatsApp or download them for accounting.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="bg-white p-7 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-emerald-50 text-[#128C7E] rounded-2xl flex items-center justify-center mb-5 border border-emerald-100">
              <FaCalendarCheck className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Fitting Scheduler</h3>
            <p className="text-slate-600 text-xs leading-relaxed">
              Schedule client fitting sessions, garment pick-ups, and final delivery dates. Send 1-click automated WhatsApp reminder links directly.
            </p>
          </div>

          {/* Feature 5 */}
          <div className="bg-white p-7 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-emerald-50 text-[#128C7E] rounded-2xl flex items-center justify-center mb-5 border border-emerald-100">
              <FaQrcode className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Printable QR Codes</h3>
            <p className="text-slate-600 text-xs leading-relaxed">
              Download your studio's custom QR code to print on physical business cards, fabric packaging bags, or workshop banners.
            </p>
          </div>

          {/* Feature 6 */}
          <div className="bg-white p-7 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-emerald-50 text-[#128C7E] rounded-2xl flex items-center justify-center mb-5 border border-emerald-100">
              <FaMobileScreenButton className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Mobile-Native UI</h3>
            <p className="text-slate-600 text-xs leading-relaxed">
              Designed with a WhatsApp-style mobile navigation bottom bar and smooth view toggles for quick operation inside busy workshops.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="bg-white py-20 border-t border-slate-200">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Get Up and Running in 3 Simple Steps
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-2">
              No technical skills needed. Set up your digital tailoring studio in less than 2 minutes.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 text-center space-y-3">
              <div className="w-10 h-10 bg-[#128C7E] text-white font-black text-sm rounded-2xl flex items-center justify-center mx-auto shadow-md">
                1
              </div>
              <h3 className="font-extrabold text-base text-slate-900">Create Brand Profile</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Enter your tailoring business name, logo, tagline, and WhatsApp phone number to create your storefront link.
              </p>
            </div>

            <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 text-center space-y-3">
              <div className="w-10 h-10 bg-[#128C7E] text-white font-black text-sm rounded-2xl flex items-center justify-center mx-auto shadow-md">
                2
              </div>
              <h3 className="font-extrabold text-base text-slate-900">Add Designs & Sizes</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Upload your dress catalogue with prices and record client sizing parameters per outfit category.
              </p>
            </div>

            <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 text-center space-y-3">
              <div className="w-10 h-10 bg-[#25D366] text-slate-950 font-black text-sm rounded-2xl flex items-center justify-center mx-auto shadow-md">
                3
              </div>
              <h3 className="font-extrabold text-base text-slate-900">Share Link & Close Sales</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Paste your store link on Instagram, WhatsApp Status, or print your QR code to receive direct order requests.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="max-w-6xl mx-auto px-4 py-20 border-t border-slate-200">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-2">
            Start for free and upgrade as your fashion brand grows.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Free Tier */}
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <span className="text-xs font-extrabold uppercase text-slate-400 tracking-wider">
                Free Forever
              </span>
              <h3 className="text-3xl font-black text-slate-900">₦0 <span className="text-xs font-normal text-slate-500">/ month</span></h3>
              <p className="text-xs text-slate-600">
                Perfect for independent tailors and emerging fashion designers getting started.
              </p>
              
              <hr className="border-slate-100" />

              <ul className="space-y-3 text-xs font-semibold text-slate-700">
                <li className="flex items-center gap-2">
                  <FaCheck className="text-[#128C7E]" /> Up to 15 Client Measurement Profiles
                </li>
                <li className="flex items-center gap-2">
                  <FaCheck className="text-[#128C7E]" /> Up to 10 Outfit Catalogue Listings
                </li>
                <li className="flex items-center gap-2">
                  <FaCheck className="text-[#128C7E]" /> Public Storefront Link & QR Code
                </li>
                <li className="flex items-center gap-2">
                  <FaCheck className="text-[#128C7E]" /> Direct WhatsApp Order Routing
                </li>
              </ul>
            </div>

            <Link
              href="/register"
              className="w-full py-3.5 rounded-2xl border border-slate-300 text-slate-800 font-bold text-xs text-center hover:bg-slate-50 transition-colors block"
            >
              Get Started Free
            </Link>
          </div>

          {/* Pro Tier */}
          <div className="bg-gradient-to-b from-zinc-950 to-slate-900 text-white p-8 rounded-3xl shadow-xl space-y-6 flex flex-col justify-between relative overflow-hidden border border-zinc-800">
            <div className="absolute top-4 right-4 bg-[#128C7E] text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
              Most Popular
            </div>

            <div className="space-y-4">
              <span className="text-xs font-extrabold uppercase text-[#25D366] tracking-wider">
                Pro Master Tailor
              </span>
              <h3 className="text-3xl font-black">₦5,000 <span className="text-xs font-normal text-zinc-400">/ month</span></h3>
              <p className="text-xs text-zinc-300">
                For established fashion houses requiring unlimited client records and PDF invoicing.
              </p>

              <hr className="border-zinc-800" />

              <ul className="space-y-3 text-xs font-medium text-zinc-200">
                <li className="flex items-center gap-2">
                  <FaCheck className="text-[#25D366]" /> **Unlimited** Client Measurement Storage
                </li>
                <li className="flex items-center gap-2">
                  <FaCheck className="text-[#25D366]" /> **Unlimited** Design Catalogue Listings
                </li>
                <li className="flex items-center gap-2">
                  <FaCheck className="text-[#25D366]" /> 1-Click PDF Invoices & Deposit Receipts
                </li>
                <li className="flex items-center gap-2">
                  <FaCheck className="text-[#25D366]" /> Fitting & Pickup Session Scheduler
                </li>
                <li className="flex items-center gap-2">
                  <FaCheck className="text-[#25D366]" /> Custom Branding (Remove StyleThread Badge)
                </li>
              </ul>
            </div>

            <Link
              href="/register"
              className="w-full py-3.5 rounded-2xl bg-[#128C7E] hover:bg-[#0e6d62] text-white font-bold text-xs text-center shadow-lg transition-all block active:scale-95"
            >
              Upgrade to Pro Studio
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="bg-white py-20 border-t border-slate-200">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-2">
              Everything you need to know about setting up your digital studio.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="border border-slate-200 rounded-2xl overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(index)}
                  className="w-full text-left p-5 text-sm font-extrabold text-slate-900 flex justify-between items-center bg-slate-50/50 hover:bg-slate-100/60 transition-colors"
                >
                  <span>{faq.q}</span>
                  <FaChevronDown
                    className={`h-4 w-4 text-slate-400 transition-transform duration-200 ${
                      openFaq === index ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {openFaq === index && (
                  <div className="p-5 text-xs text-slate-600 leading-relaxed bg-white border-t border-slate-100">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Banner */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="bg-gradient-to-r from-[#128C7E] to-[#0e6d62] rounded-3xl p-8 sm:p-12 text-white text-center space-y-6 shadow-xl relative overflow-hidden">
          <div className="max-w-2xl mx-auto space-y-3">
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight">
              Ready to Upgrade Your Tailoring Studio?
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100 font-medium">
              Join hundreds of fashion designers saving hours every week with StyleThread.
            </p>
          </div>

          <div className="pt-2">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 bg-white text-[#128C7E] font-black px-8 py-4 rounded-2xl text-xs sm:text-sm shadow-lg hover:bg-emerald-50 transition-all active:scale-95"
            >
              Start Free Trial Now <FaArrowRight />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-8 text-center text-xs text-slate-500 font-medium">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="bg-[#128C7E] text-white p-1.5 rounded-lg">
              <FaShirt className="h-4 w-4" />
            </div>
            <span className="font-bold text-slate-800">StyleThread</span>
          </div>
          <p>© {new Date().getFullYear()} StyleThread Inc. All rights reserved.</p>
          <div className="flex items-center gap-1 text-slate-400">
            <FaShieldHalved /> Secure Cloud Infrastructure
          </div>
        </div>
      </footer>

    </div>
  );
}