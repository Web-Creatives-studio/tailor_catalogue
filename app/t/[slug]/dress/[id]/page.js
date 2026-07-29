'use client';

import { useState, useEffect, use, Suspense } from 'react';
import Link from 'next/link';
import { FaWhatsapp, FaArrowLeft, FaHeart, FaRegHeart, FaRulerHorizontal } from 'react-icons/fa6';
import { FiLoader } from 'react-icons/fi';

// Force Next.js App Router dynamic execution (Prevents build-time static render errors)
export const dynamic = "force-dynamic";

function DressDetailContent({ params: paramsPromise }) {
  const params = use(paramsPromise);
  const { slug, id } = params;

  const [dress, setDress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    async function loadDress() {
      if (!id) return;
      try {
        setLoading(true);
        const res = await fetch(`/api/dress/${id}`, { cache: "no-store" });
        if (!res.ok) {
          if (res.status === 404) setNotFound(true);
          return;
        }
        const data = await res.json();
        setDress(data.dress);
      } catch (err) {
        console.error("Failed to fetch dress from DB:", err);
      } finally {
        setLoading(false);
      }
    }
    loadDress();
  }, [id]);

  if (loading) {
    return <LoadingIndicator />;
  }

  if (notFound || !dress) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 text-center font-sans">
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm max-w-md w-full space-y-4">
          <h2 className="text-2xl font-black text-slate-800">Outfit Not Found</h2>
          <p className="text-xs text-slate-500">
            This design listing is no longer available or may have been removed by the tailor.
          </p>
          <Link
            href={`/t/${slug}`}
            className="inline-block bg-[#128C7E] text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-md hover:bg-[#0e6d62] transition-colors"
          >
            Back to Catalogue
          </Link>
        </div>
      </div>
    );
  }

  // Construct absolute URL dynamically
  const currentUrl =
    typeof window !== "undefined"
      ? window.location.href
      : `http://localhost:3000/t/${slug}/dress/${dress.id}`;

  const whatsappLink = `https://wa.me/${dress.whatsapp}?text=${encodeURIComponent(
    `Hi ${dress.tailorName || ""}, I want to inquire about ordering "${dress.title}" (₦${dress.price ? dress.price.toLocaleString() : "Contact for Price"}).\n\nProduct Link: ${currentUrl}`
  )}`;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-28 lg:pb-16 font-sans">
      
      {/* Top Bar */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-20 px-4 sm:px-8 py-3.5 shadow-sm">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link href={`/t/${slug}`} className="flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-700 hover:text-[#128C7E] transition-colors">
            <FaArrowLeft className="h-3.5 w-3.5" /> Back to Catalogue
          </Link>
          <button 
            type="button"
            onClick={() => setIsLiked(!isLiked)} 
            className="p-2 text-slate-600 hover:text-red-500 transition-colors cursor-pointer"
          >
            {isLiked ? <FaHeart className="h-5 w-5 text-red-500" /> : <FaRegHeart className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-4 sm:mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 items-start">
          
          {/* Gallery Column */}
          <div className="space-y-3 sm:space-y-4">
            <div className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm relative aspect-square sm:aspect-[4/5] lg:aspect-square">
              <img 
                src={dress.images[activeImage] || dress.images[0]} 
                alt={dress.title} 
                className="w-full h-full object-cover" 
              />
            </div>

            {/* Thumbnails */}
            {dress.images.length > 1 && (
              <div className="flex gap-2.5 overflow-x-auto pb-1 scrollbar-none">
                {dress.images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImage(idx)}
                    className={`w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 cursor-pointer ${
                      activeImage === idx ? 'border-[#128C7E] ring-2 ring-[#128C7E]/20 scale-95' : 'border-slate-200 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details Column */}
          <div className="bg-white p-5 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4 sm:space-y-6">
            <div>
              <span className="text-xs uppercase font-extrabold text-[#128C7E] tracking-wider">{dress.category}</span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">{dress.title}</h1>
              {dress.price ? (
                <p className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">₦{dress.price.toLocaleString()}</p>
              ) : (
                <p className="text-lg font-bold text-slate-500 mt-2">Price on Request</p>
              )}
            </div>
            
            <hr className="border-slate-100" />

            <div>
              <h3 className="text-xs font-bold uppercase text-slate-400 mb-1.5">Design Description</h3>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">{dress.description}</p>
            </div>

            <div className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-slate-600 bg-slate-50 p-3.5 sm:p-4 rounded-xl border border-slate-100">
              <FaRulerHorizontal className="text-[#128C7E] text-base" />
              Estimated Completion: <span className="text-slate-900 font-bold">{dress.completionTime}</span>
            </div>

            {/* Desktop Action Trigger */}
            <div className="hidden lg:block pt-2">
              <a
                href={whatsappLink}
                target="_blank"
                rel="noreferrer"
                className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-slate-950 font-extrabold py-4 rounded-xl text-sm transition-all shadow-md active:scale-[0.99]"
              >
                <FaWhatsapp className="h-5 w-5" /> Order via WhatsApp
              </a>
            </div>
          </div>

        </div>
      </div>

      {/* Floating Bottom Bar (Mobile Only) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur border-t border-slate-200 p-4 z-30 shadow-lg">
        <div className="max-w-md mx-auto">
          <a
            href={whatsappLink}
            target="_blank"
            rel="noreferrer"
            className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-slate-950 font-extrabold py-3.5 rounded-xl text-sm transition-all shadow-md active:scale-[0.98]"
          >
            <FaWhatsapp className="h-5 w-5" /> Order via WhatsApp
          </a>
        </div>
      </div>

    </div>
  );
}

// Loading UI Indicator
function LoadingIndicator() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center font-sans">
      <div className="text-center space-y-3">
        <FiLoader className="w-8 h-8 text-[#128C7E] animate-spin mx-auto" />
        <p className="text-xs font-bold text-slate-500 tracking-wider uppercase">
          Loading Outfit Details...
        </p>
      </div>
    </div>
  );
}

// Default Export wrapped in Suspense for Next.js build optimization
export default function DressDetailPage(props) {
  return (
    <Suspense fallback={<LoadingIndicator />}>
      <DressDetailContent {...props} />
    </Suspense>
  );
}