"use client";

import React, { useState, useEffect, Suspense } from "react";
import { QRCodeSVG } from "qrcode.react";
import {
  FiEye,
  FiTag,
  FiLink,
  FiCopy,
  FiExternalLink,
  FiBarChart2,
  FiPieChart,
  FiLoader,
} from "react-icons/fi";

// Force Next.js App Router dynamic execution (Prevents build-time static render errors)
export const dynamic = "force-dynamic";

// 1. Core Component carrying dashboard logic
function DashboardContent() {
  const [copied, setCopied] = useState(false);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;

    async function fetchDashboard() {
      try {
        const res = await fetch("/api/dashboard", { cache: "no-store" });
        if (res.ok) {
          const result = await res.json();
          setData(result.tailor);
        }
      } catch (err) {
        console.error("Failed to load dashboard data", err);
      } finally {
        setLoading(false);
      }
    }
    fetchDashboard();
  }, []);

  const catalogUrl =
    typeof window !== "undefined" && data?.slug
      ? `${window.location.origin}/t/${data.slug}`
      : `http://localhost:3000/t/${data?.slug || "kora-couture"}`;

  const copyToClipboard = () => {
    if (typeof navigator !== "undefined") {
      navigator.clipboard.writeText(catalogUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return <LoadingIndicator />;
  }

  const tailor = data || {
    businessName: "Your Brand",
    slug: "brand",
    views: 0,
    totalDresses: 0,
    categoriesCount: 0,
    categoryStats: [],
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex justify-between items-center bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div>
            <h1 className="text-2xl font-black text-slate-900">{tailor.businessName}</h1>
            <p className="text-xs text-slate-500 mt-0.5">Live performance metrics & catalogue link</p>
          </div>
        </div>

        {/* Analytics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase text-slate-400">Total Views</p>
              <h3 className="text-2xl font-bold text-slate-800 mt-1">{tailor.views || 0}</h3>
            </div>
            <div className="p-3 bg-emerald-50 text-[#128C7E] rounded-xl">
              <FiEye className="h-5 w-5" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase text-slate-400">Total Outfits</p>
              <h3 className="text-2xl font-bold text-slate-800 mt-1">{tailor.totalDresses || 0}</h3>
            </div>
            <div className="p-3 bg-emerald-50 text-[#128C7E] rounded-xl">
              <FiTag className="h-5 w-5" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase text-slate-400">Categories</p>
              <h3 className="text-2xl font-bold text-slate-800 mt-1">{tailor.categoriesCount || 0}</h3>
            </div>
            <div className="p-3 bg-emerald-50 text-[#128C7E] rounded-xl">
              <FiBarChart2 className="h-5 w-5" />
            </div>
          </div>
        </div>

        {/* Chart & Share Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Category Distribution Chart */}
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
            <h2 className="font-bold text-slate-900 flex items-center gap-2 text-base">
              <FiPieChart className="h-5 w-5 text-[#128C7E]" /> Dress Distribution by Category
            </h2>

            {!tailor.categoryStats || tailor.categoryStats.length === 0 ? (
              <div className="h-48 flex items-center justify-center border border-dashed border-slate-200 rounded-xl text-xs text-slate-400">
                No categories created yet. Create a category to see analytics.
              </div>
            ) : (
              <div className="space-y-3 pt-2">
                {tailor.categoryStats.map((cat) => {
                  const percentage = tailor.totalDresses > 0 
                    ? Math.round((cat.count / tailor.totalDresses) * 100) 
                    : 0;

                  return (
                    <div key={cat.name} className="space-y-1">
                      <div className="flex justify-between text-xs font-bold text-slate-700">
                        <span>{cat.name}</span>
                        <span>{cat.count} dresses ({percentage}%)</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                        <div 
                          className="bg-[#128C7E] h-full rounded-full transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Share Links & QR */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
              <h2 className="font-bold text-slate-900 flex items-center gap-2 text-sm">
                <FiLink className="h-5 w-5 text-[#128C7E]" /> Unique Link
              </h2>
              <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-xl border border-slate-200">
                <input
                  type="text"
                  readOnly
                  value={catalogUrl}
                  className="bg-transparent text-xs w-full outline-none text-slate-600 px-1 truncate"
                />
                <button
                  type="button"
                  onClick={copyToClipboard}
                  className="bg-[#128C7E] text-white px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 hover:bg-[#0e6d62] transition-colors cursor-pointer"
                >
                  <FiCopy className="h-3.5 w-3.5" /> {copied ? "Copied!" : "Copy"}
                </button>
              </div>
              <a
                href={catalogUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-xs text-[#128C7E] font-semibold hover:underline"
              >
                Preview public page <FiExternalLink className="h-3 w-3" />
              </a>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
              <div className="p-2 border rounded-xl bg-white shadow-sm flex-shrink-0">
                <QRCodeSVG value={catalogUrl} size={85} />
              </div>
              <div className="space-y-1.5">
                <h3 className="font-bold text-slate-900 text-xs">Print QR Code</h3>
                <p className="text-[11px] text-slate-500 leading-tight">
                  Place on physical shop banners or bags.
                </p>
                <button
                  type="button"
                  onClick={() => typeof window !== "undefined" && window.print()}
                  className="bg-slate-900 text-white text-xs px-3 py-1.5 rounded-lg font-medium hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Print QR
                </button>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

// 2. Extracted Loading UI for clean Suspense fallback usage
function LoadingIndicator() {
  return (
    <div className="min-h-screen bg-slate-50 p-8 flex flex-col items-center justify-center gap-3 text-slate-400 font-sans">
      <FiLoader className="animate-spin text-[#128C7E]" size={28} />
      <p className="text-xs font-bold uppercase tracking-widest text-slate-500">
        Loading Analytics...
      </p>
    </div>
  );
}

// 3. Default Export wrapped inside Suspense to pass builds seamlessly
export default function Dashboard() {
  return (
    <Suspense fallback={<LoadingIndicator />}>
      <DashboardContent />
    </Suspense>
  );
}