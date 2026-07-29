"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import {
  FaWhatsapp,
  FaPhone,
  FaLocationDot,
  FaCheck,
  FaHeart,
  FaRegHeart,
  FaArrowRight,
} from "react-icons/fa6";

// Force Next.js App Router dynamic execution (Prevents build-time static render errors)
export const dynamic = "force-dynamic";

export default function PublicCatalogue({ params: paramsPromise }) {
  const params = use(paramsPromise);
  const slug = params?.slug;

  const [tailor, setTailor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    async function loadCatalogue() {
      if (!slug) return;
      try {
        setLoading(true);
        const res = await fetch(`/api/catalogue/${slug}`, { cache: "no-store" });
        if (!res.ok) {
          if (res.status === 404) setNotFound(true);
          return;
        }
        const data = await res.json();
        setTailor(data.tailor);
      } catch (err) {
        console.error("Failed to load catalogue from DB:", err);
      } finally {
        setLoading(false);
      }
    }
    loadCatalogue();
  }, [slug]);

  const toggleWishlist = (dressId) => {
    setWishlist((prev) =>
      prev.includes(dressId)
        ? prev.filter((id) => id !== dressId)
        : [...prev, dressId]
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white font-sans">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-[#25D366] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-bold text-slate-400 tracking-wider uppercase">
            Loading Catalogue...
          </p>
        </div>
      </div>
    );
  }

  if (notFound || !tailor) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 text-center font-sans">
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm max-w-md w-full space-y-4">
          <h2 className="text-2xl font-black text-slate-800">Catalogue Not Found</h2>
          <p className="text-xs text-slate-500">
            The tailor page you are looking for does not exist or may have been updated.
          </p>
          <Link
            href="/"
            className="inline-block bg-[#128C7E] text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-md hover:bg-[#0e6d62] transition-colors"
          >
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  const filteredDresses =
    selectedCategory === "All"
      ? tailor.dresses
      : tailor.dresses.filter((d) => d.category === selectedCategory);

  const getGeneralWhatsAppLink = () => {
    const text = `Hi ${tailor.businessName}, I saw your catalogue and would like to make an inquiry.`;
    return `https://wa.me/${tailor.whatsapp}?text=${encodeURIComponent(text)}`;
  };

  const getDressWhatsAppLink = (dressTitle, dressId) => {
    const origin =
      typeof window !== "undefined"
        ? window.location.origin
        : "http://localhost:3000";
    const dressPageUrl = `${origin}/t/${tailor.slug}/dress/${dressId}`;

    const text = `Hi ${tailor.businessName}, I am interested in ordering "${dressTitle}".\n\nView Design: ${dressPageUrl}`;

    return `https://wa.me/${tailor.whatsapp}?text=${encodeURIComponent(text)}`;
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 pb-16 font-sans">
      {/* --- RESPONSIVE HERO SECTION --- */}
      <div className="relative bg-slate-900 text-white pt-10 pb-12 sm:pt-16 sm:pb-20 px-4 text-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30 transform scale-105"
          style={{ backgroundImage: `url('${tailor.heroBgUrl}')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/75 to-slate-900/50" />

        <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center">
          {/* Logo / Avatar */}
          <div className="relative mb-3 sm:mb-5">
            {tailor.logoUrl ? (
              <img
                src={tailor.logoUrl}
                alt={tailor.businessName}
                className="w-20 h-20 sm:w-28 sm:h-28 rounded-full object-cover border-4 border-[#128C7E] shadow-2xl"
              />
            ) : (
              <div className="w-20 h-20 sm:w-28 sm:h-28 bg-[#128C7E] text-white rounded-full flex items-center justify-center font-extrabold text-2xl sm:text-4xl border-4 border-white/20 shadow-2xl backdrop-blur-sm">
                {tailor.businessName[0]}
              </div>
            )}
            <span
              className="absolute bottom-1 right-1 bg-[#25D366] text-slate-950 p-1 sm:p-1.5 rounded-full border-2 border-slate-900 text-xs shadow-md"
              title="Verified Tailor"
            >
              <FaCheck className="h-2.5 w-2.5 sm:h-3.5 sm:w-3.5" />
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight drop-shadow-md">
            {tailor.businessName}
          </h1>

          <p className="text-[11px] sm:text-xs font-bold text-[#25D366] mt-1.5 tracking-widest uppercase">
            {tailor.tagline}
          </p>

          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto mt-3 leading-relaxed px-2 font-normal">
            {tailor.bio}
          </p>

          {tailor.location && (
            <div className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-200 mt-4 bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/15">
              <FaLocationDot className="text-[#25D366]" />
              {tailor.location}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-6 sm:mt-8 w-full max-w-xs sm:max-w-md">
            <a
              href={getGeneralWhatsAppLink()}
              target="_blank"
              rel="noreferrer"
              className="w-full sm:w-auto sm:flex-1 flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-slate-950 font-extrabold py-3 px-5 rounded-xl text-xs sm:text-sm transition-all shadow-lg shadow-[#25D366]/20 active:scale-[0.98]"
            >
              <FaWhatsapp className="h-4 w-4" /> Chat on WhatsApp
            </a>

            {tailor.phone && (
              <a
                href={`tel:${tailor.phone}`}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold py-3 px-5 rounded-xl text-xs sm:text-sm border border-white/20 backdrop-blur-md transition-all active:scale-[0.98]"
              >
                <FaPhone className="h-3.5 w-3.5 text-slate-300" /> Call Shop
              </a>
            )}
          </div>
        </div>
      </div>

      {/* --- STICKY CATEGORIES FILTER --- */}
      <div className="sticky top-0 bg-white/95 backdrop-blur border-b border-slate-200 z-20 px-4 py-3 shadow-sm">
        <div className="max-w-7xl mx-auto flex gap-2 overflow-x-auto scrollbar-none justify-start sm:justify-center">
          {tailor.categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 sm:px-5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? "bg-[#128C7E] text-white shadow-md"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* --- RESPONSIVE OUTFIT GRID --- */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 sm:mt-8">
        {filteredDresses.length === 0 ? (
          <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center text-xs text-slate-500">
            No outfits found in this category.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {filteredDresses.map((dress) => {
              const isLiked = wishlist.includes(dress.id);

              return (
                <div
                  key={dress.id}
                  className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-xl transition-all duration-300 group relative"
                >
                  {/* Image Container */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => toggleWishlist(dress.id)}
                      className="absolute top-3 right-3 z-10 p-2.5 bg-white/80 backdrop-blur-md rounded-full shadow-md text-slate-700 hover:text-red-500 transition-all active:scale-90 cursor-pointer"
                      aria-label="Save to Wishlist"
                    >
                      {isLiked ? (
                        <FaHeart className="h-4 w-4 text-red-500" />
                      ) : (
                        <FaRegHeart className="h-4 w-4" />
                      )}
                    </button>

                    {dress.images.length > 1 && (
                      <span className="absolute bottom-3 right-3 z-10 text-[10px] font-bold text-white bg-slate-900/70 backdrop-blur-sm px-2 py-0.5 rounded-md">
                        1/{dress.images.length}
                      </span>
                    )}

                    {/* Horizontal Scroll */}
                    <div className="flex overflow-x-auto snap-x snap-mandatory scrollbar-none h-72 sm:h-80">
                      {dress.images.map((imgUrl, idx) => (
                        <Link
                          key={idx}
                          href={`/t/${tailor.slug}/dress/${dress.id}`}
                          className="flex-shrink-0 w-full h-full snap-start relative block"
                        >
                          <img
                            src={imgUrl}
                            alt={`${dress.title} view ${idx + 1}`}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </Link>
                      ))}
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase font-extrabold text-[#128C7E] tracking-wider">
                          {dress.category}
                        </span>
                        {dress.images.length > 1 && (
                          <span className="text-[10px] text-slate-400 font-medium">
                            Swipe ➔
                          </span>
                        )}
                      </div>

                      <Link
                        href={`/t/${tailor.slug}/dress/${dress.id}`}
                        className="block group-hover:text-[#128C7E] transition-colors"
                      >
                        <h3 className="font-bold text-slate-800 text-base sm:text-lg mt-1 flex items-center justify-between">
                          {dress.title}
                          <FaArrowRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-all text-[#128C7E] -translate-x-2 group-hover:translate-x-0" />
                        </h3>
                      </Link>
                    </div>

                    {dress.price && (
                      <p className="text-base font-extrabold text-slate-900 mt-2">
                        ₦{dress.price.toLocaleString()}
                      </p>
                    )}
                  </div>

                  {/* Order Trigger */}
                  <div className="p-4 sm:p-5 pt-0">
                    <a
                      href={getDressWhatsAppLink(dress.title, dress.id)}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-slate-950 font-extrabold py-3 rounded-xl text-xs sm:text-sm transition-all shadow-sm active:scale-[0.98]"
                    >
                      <FaWhatsapp className="h-4 w-4" /> Order on WhatsApp
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}