import Link from 'next/link';
import { FaShirt, FaWhatsapp, FaQrcode, FaHandSparkles, FaArrowRight } from 'react-icons/fa6';
//import { FaShirt } from 'react-icons/fa6';



export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Navigation */}
      <nav className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-[#128C7E] text-white p-2 rounded-xl">
              <FaShirt className="h-6 w-6" />
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-800">StyleThread</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors">
              Log in
            </Link>
            <Link href="/register" className="text-sm font-semibold bg-[#25D366] hover:bg-[#20bd5a] text-slate-950 px-4 py-2 rounded-lg transition-all shadow-sm">
              Get Started Free
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-4xl mx-auto px-4 pt-20 pb-16 text-center">
        <div className="inline-flex items-center gap-2 bg-[#128C7E]/10 text-[#128C7E] px-3 py-1 rounded-full text-sm font-semibold mb-6">
          <FaHandSparkles className="h-4 w-4" /> Built for Modern Fashion Designers
        </div>
        <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight mb-6">
          Showcase Your Designs.<br/>
          <span className="text-[#128C7E]">Close Orders on WhatsApp.</span>
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-8 leading-relaxed">
          Create a sleek digital catalogue for your tailor shop in under 2 minutes. Share one clean link or QR code with clients instead of sending endless WhatsApp photos.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/register" className="flex items-center justify-center gap-2 bg-[#128C7E] hover:bg-[#0e6d62] text-white font-medium px-8 py-3.5 rounded-xl text-lg transition-all shadow-lg shadow-[#128C7E]/20">
            Create Your Catalogue <FaArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Feature Highlights */}
      <section className="max-w-6xl mx-auto px-4 py-16 border-t border-slate-200">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <div className="w-12 h-12 bg-emerald-100 text-[#128C7E] rounded-xl flex items-center justify-center mb-4">
              <FaShirt className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold mb-2">Up to 4 High-Res Photos</h3>
            <p className="text-slate-600 text-sm">Organize your outfits by categories like Suits, Agbada, or Gowns with multi-angle photos.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <div className="w-12 h-12 bg-emerald-100 text-[#25D366] rounded-xl flex items-center justify-center mb-4">
              <FaWhatsapp className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold mb-2">Direct WhatsApp Orders</h3>
            <p className="text-slate-600 text-sm">Customers click one button to open WhatsApp with the exact dress details pre-filled in their message.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <div className="w-12 h-12 bg-emerald-100 text-[#128C7E] rounded-xl flex items-center justify-center mb-4">
              <FaQrcode className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold mb-2">Printable QR Code</h3>
            <p className="text-slate-600 text-sm">Download your custom QR code to print on packaging bags, business cards, or shop banners.</p>
          </div>
        </div>
      </section>
    </div>
  );
}