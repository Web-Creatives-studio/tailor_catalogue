"use client";

import React, { useState, useEffect, useRef, useCallback, Suspense } from "react";
import { QRCodeSVG } from "qrcode.react";
import Link from "next/link";
import {
  FiEye,
  FiTag,
  FiLink,
  FiCopy,
  FiExternalLink,
  FiBarChart2,
  FiPieChart,
  FiLoader,
  FiPlus,
  FiUsers,
  FiFileText,
  FiDownload,
  FiTrendingUp,
  FiCheck,
  FiDollarSign,
  FiAlertCircle,
  FiFilter,
  FiRefreshCw,
} from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa6";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

export const dynamic = "force-dynamic";

function DashboardContent() {
  const [copied, setCopied] = useState(false);
  const [data, setData] = useState(null);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [timeFilter, setTimeFilter] = useState("all"); // Default to "all" to reveal initial records immediately
  const qrRef = useRef(null);

  // Core Data Sync Function (Real-Time Pull)
  const loadDashboardData = useCallback(async (isSilent = false) => {
    if (!isSilent) setRefreshing(true);
    try {
      const [dashRes, invRes] = await Promise.all([
        fetch("/api/dashboard", { cache: "no-store" }),
        fetch("/api/invoices", { cache: "no-store" }),
      ]);

      if (dashRes.ok) {
        const result = await dashRes.json();
        setData(result.tailor);
      }

      if (invRes.ok) {
        const invData = await invRes.json();
        setInvoices(invData.invoices || []);
      }
    } catch (err) {
      console.error("Failed to load dashboard data", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // 1. Initial Load & Real-Time Polling (Every 5 seconds)
  useEffect(() => {
    loadDashboardData(false);

    // Set up 5-second polling interval for live synchronization
    const interval = setInterval(() => {
      loadDashboardData(true);
    }, 5000);

    // Re-fetch on tab focus
    const handleFocus = () => loadDashboardData(true);
    window.addEventListener("focus", handleFocus);

    return () => {
      clearInterval(interval);
      window.removeEventListener("focus", handleFocus);
    };
  }, [loadDashboardData]);

  // Robust Date Filtering Matrix
  const filterInvoicesByTime = (invList, filter) => {
    const now = new Date();
    return invList.filter((inv) => {
      const invDate = new Date(inv.createdAt);
      if (isNaN(invDate.getTime())) return true;

      if (filter === "week") {
        const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return invDate >= sevenDaysAgo;
      }
      if (filter === "month") {
        const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        return invDate >= thirtyDaysAgo;
      }
      if (filter === "year") {
        return invDate.getFullYear() === now.getFullYear();
      }
      return true; // "all"
    });
  };

  const filteredInvoices = filterInvoicesByTime(invoices, timeFilter);

  // Real-Time Financial Calculations
  const totalBilled = filteredInvoices.reduce(
    (sum, inv) => sum + Number(inv.totalAmount || 0),
    0
  );
  const totalCollected = filteredInvoices.reduce(
    (sum, inv) => sum + Number(inv.depositPaid || 0),
    0
  );
  const totalOutstanding = filteredInvoices.reduce(
    (sum, inv) => sum + Number(inv.balanceDue || 0),
    0
  );

  // Compute Revenue per Outfit Category for Recharts Bar Chart
  const categoryRevenueData = React.useMemo(() => {
    const map = {};
    filteredInvoices.forEach((inv) => {
      const cat = inv.category || "General";
      const revenue = Number(inv.totalAmount || 0);
      map[cat] = (map[cat] || 0) + revenue;
    });

    return Object.keys(map).map((catName) => ({
      category: catName,
      revenue: map[catName],
    }));
  }, [filteredInvoices]);

  const catalogUrl =
    typeof window !== "undefined" && data?.slug
      ? `${window.location.origin}/t/${data.slug}`
      : `http://localhost:3000/t/${data?.slug || "brand"}`;

  const copyToClipboard = () => {
    if (typeof navigator !== "undefined") {
      navigator.clipboard.writeText(catalogUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleShareWhatsApp = () => {
    const message = `Hello! Check out our latest bespoke outfit designs on *${
      data?.businessName || "StyleThread"
    }*:\n\n${catalogUrl}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, "_blank");
  };

  const handleDownloadQR = () => {
    if (!qrRef.current) return;
    const svg = qrRef.current.querySelector("svg");
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width + 40;
      canvas.height = img.height + 40;
      if (ctx) {
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 20, 20);
        const pngFile = canvas.toDataURL("image/png");
        const downloadLink = document.createElement("a");
        downloadLink.download = `${data?.slug || "brand"}-storefront-qr.png`;
        downloadLink.href = pngFile;
        downloadLink.click();
      }
    };

    img.src =
      "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
  };

  if (loading) {
    return <LoadingIndicator />;
  }

  const tailor = data || {
    businessName: "StyleThread Studio",
    slug: "brand",
    views: 0,
    totalDresses: 0,
    categoriesCount: 0,
  };

  const CHART_COLORS = ["#128C7E", "#25D366", "#0D9488", "#0284C7", "#6366F1"];

  return (
    <div className="h-full flex flex-col font-sans">
      <div className="max-w-6xl w-full mx-auto space-y-6 py-2">
        
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-zinc-950 via-zinc-900 to-slate-900 p-6 sm:p-8 rounded-3xl text-white shadow-xl relative overflow-hidden border border-zinc-800">
          <div className="absolute right-0 top-0 -mt-10 -mr-10 w-64 h-64 bg-[#128C7E]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#128C7E]/20 border border-[#128C7E]/40 text-[#25D366] text-xs font-bold uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse" />
                Live Financial Sync Active
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                {tailor.businessName}
              </h1>
              <p className="text-xs text-zinc-400 max-w-lg leading-relaxed">
                Real-time financial metrics, automated invoice tallies, and client debt tracking.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={() => loadDashboardData(false)}
                className="p-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-xl border border-zinc-700 transition-all cursor-pointer"
                title="Sync Live Data"
              >
                <FiRefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin text-[#25D366]" : ""}`} />
              </button>
              <Link
                href="/dashboard/measurement"
                className="inline-flex items-center gap-2 bg-[#128C7E] hover:bg-[#0e6d62] text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md active:scale-95"
              >
                <FiFileText className="h-4 w-4" /> Create Invoice
              </Link>
            </div>
          </div>
        </div>

        {/* Date Filter Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
            <FiFilter className="text-[#128C7E]" />
            <span>Time Horizon Filter:</span>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
            {[
              { label: "All Time", value: "all" },
              { label: "This Week", value: "week" },
              { label: "This Month", value: "month" },
              { label: "This Year", value: "year" },
            ].map((f) => (
              <button
                key={f.value}
                type="button"
                onClick={() => setTimeFilter(f.value)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  timeFilter === f.value
                    ? "bg-[#128C7E] text-white shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Financial KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {/* Revenue Collected */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                  Collected Revenue
                </p>
                <h3 className="text-3xl font-black text-slate-900 mt-1">
                  ₦{totalCollected.toLocaleString()}
                </h3>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 mt-2">
                  <FiTrendingUp className="h-3.5 w-3.5" /> Cash received in hand
                </span>
              </div>
              <div className="p-3.5 bg-emerald-50 text-[#128C7E] rounded-2xl group-hover:scale-110 transition-transform">
                <FiDollarSign className="h-6 w-6" />
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#128C7E]" />
          </div>

          {/* Outstanding Debts */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                  Outstanding Balances
                </p>
                <h3 className="text-3xl font-black text-red-600 mt-1">
                  ₦{totalOutstanding.toLocaleString()}
                </h3>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-red-500 mt-2">
                  <FiAlertCircle className="h-3.5 w-3.5" /> Uncollected client debt
                </span>
              </div>
              <div className="p-3.5 bg-red-50 text-red-600 rounded-2xl group-hover:scale-110 transition-transform">
                <FiAlertCircle className="h-6 w-6" />
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-red-500" />
          </div>

          {/* Total Billed */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                  Total Billed Value
                </p>
                <h3 className="text-3xl font-black text-slate-900 mt-1">
                  ₦{totalBilled.toLocaleString()}
                </h3>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500 mt-2">
                  Gross invoice total ({filteredInvoices.length} invoices)
                </span>
              </div>
              <div className="p-3.5 bg-emerald-50 text-[#128C7E] rounded-2xl group-hover:scale-110 transition-transform">
                <FiFileText className="h-6 w-6" />
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-emerald-500/40" />
          </div>
        </div>

        {/* Charts & Storefront Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          
          {/* Revenue per Outfit Category Chart (Recharts) */}
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="font-extrabold text-slate-900 flex items-center gap-2 text-base">
                <FiBarChart2 className="h-5 w-5 text-[#128C7E]" /> Revenue by Garment Category
              </h2>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Sales Breakdown (₦)
              </span>
            </div>

            {categoryRevenueData.length === 0 ? (
              <div className="h-60 flex flex-col items-center justify-center border-2 border-dashed border-slate-100 rounded-2xl p-6 text-center space-y-2">
                <FiDollarSign className="h-8 w-8 text-slate-300" />
                <p className="text-xs font-bold text-slate-500">
                  No invoice data recorded for this filter.
                </p>
                <p className="text-[11px] text-slate-400">
                  Create customer invoices to inspect live category revenue analytics.
                </p>
              </div>
            ) : (
              <div className="h-64 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={categoryRevenueData}>
                    <XAxis
                      dataKey="category"
                      stroke="#94A3B8"
                      fontSize={11}
                      tickLine={false}
                    />
                    <YAxis
                      stroke="#94A3B8"
                      fontSize={11}
                      tickLine={false}
                      tickFormatter={(val) => `₦${val / 1000}k`}
                    />
                    <Tooltip
                      formatter={(value) => [`₦${Number(value).toLocaleString()}`, "Revenue"]}
                      contentStyle={{
                        backgroundColor: "#111827",
                        borderRadius: "12px",
                        color: "#FFF",
                        fontSize: "12px",
                      }}
                    />
                    <Bar dataKey="revenue" radius={[6, 6, 0, 0]}>
                      {categoryRevenueData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={CHART_COLORS[index % CHART_COLORS.length]}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          {/* Storefront Link & QR */}
          <div className="lg:col-span-1 space-y-5">
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
              <h2 className="font-extrabold text-slate-900 flex items-center gap-2 text-sm">
                <FiLink className="h-4 w-4 text-[#128C7E]" /> Storefront URL
              </h2>

              <div className="space-y-2">
                <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-xl border border-slate-200">
                  <input
                    type="text"
                    readOnly
                    value={catalogUrl}
                    className="bg-transparent text-xs w-full outline-none text-black font-medium px-1 truncate"
                  />
                  <button
                    type="button"
                    onClick={copyToClipboard}
                    className="bg-[#128C7E] text-white px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 hover:bg-[#0e6d62] transition-colors cursor-pointer shrink-0 active:scale-95"
                  >
                    {copied ? <FiCheck className="h-3.5 w-3.5" /> : <FiCopy className="h-3.5 w-3.5" />}
                    {copied ? "Copied" : "Copy"}
                  </button>
                </div>

                <div className="flex items-center justify-between pt-1 text-xs">
                  <a
                    href={catalogUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-[#128C7E] font-bold hover:underline"
                  >
                    Preview Storefront <FiExternalLink className="h-3 w-3" />
                  </a>

                  <button
                    type="button"
                    onClick={handleShareWhatsApp}
                    className="inline-flex items-center gap-1 text-[#25D366] font-bold hover:underline cursor-pointer"
                  >
                    <FaWhatsapp className="h-3.5 w-3.5" /> Share to WhatsApp
                  </button>
                </div>
              </div>
            </div>

            {/* QR Code */}
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
              <div
                ref={qrRef}
                className="p-2.5 border border-slate-200 rounded-2xl bg-white shadow-xs shrink-0"
              >
                <QRCodeSVG value={catalogUrl} size={80} level="H" />
              </div>

              <div className="space-y-2">
                <div>
                  <h3 className="font-bold text-slate-900 text-xs">Studio QR Code</h3>
                  <p className="text-[11px] text-slate-500 leading-tight mt-0.5">
                    Print on business cards or physical fabric bags.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleDownloadQR}
                  className="bg-slate-900 hover:bg-slate-800 text-white text-xs px-3 py-1.5 rounded-lg font-bold transition-colors inline-flex items-center gap-1 cursor-pointer active:scale-95"
                >
                  <FiDownload className="h-3 w-3" /> Save PNG
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Invoices Ledger Preview */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="font-extrabold text-slate-900 flex items-center gap-2 text-base">
              <FiFileText className="h-5 w-5 text-[#128C7E]" /> Recent Studio Invoices
            </h2>
            <Link
              href="/dashboard/measurement"
              className="text-xs font-bold text-[#128C7E] hover:underline"
            >
              View Client Directory ➔
            </Link>
          </div>

          {filteredInvoices.length === 0 ? (
            <p className="text-xs text-slate-400 italic py-6 text-center">
              No recent invoice entries found.
            </p>
          ) : (
            <div className="overflow-x-auto border border-slate-200 rounded-2xl">
              <table className="w-full text-left text-xs font-sans">
                <thead className="bg-slate-50 text-slate-500 font-extrabold uppercase text-[10px] border-b border-slate-200">
                  <tr>
                    <th className="p-3">Invoice #</th>
                    <th className="p-3">Client</th>
                    <th className="p-3">Outfit Item</th>
                    <th className="p-3 text-right">Total (₦)</th>
                    <th className="p-3 text-right">Paid (₦)</th>
                    <th className="p-3 text-right">Balance (₦)</th>
                    <th className="p-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {filteredInvoices.slice(0, 5).map((inv) => (
                    <tr key={inv.id || inv.invoiceNumber} className="hover:bg-slate-50/80">
                      <td className="p-3 font-bold text-slate-900">{inv.invoiceNumber}</td>
                      <td className="p-3 font-bold text-slate-800">
                        {inv.customer?.fullName || "Client"}
                      </td>
                      <td className="p-3">
                        <div className="font-bold text-slate-800">{inv.itemTitle}</div>
                        <div className="text-[10px] text-slate-400">{inv.category}</div>
                      </td>
                      <td className="p-3 text-right font-bold">₦{Number(inv.totalAmount || 0).toLocaleString()}</td>
                      <td className="p-3 text-right font-bold text-[#128C7E]">₦{Number(inv.depositPaid || 0).toLocaleString()}</td>
                      <td className="p-3 text-right font-bold text-red-600">
                        ₦{Number(inv.balanceDue || 0).toLocaleString()}
                      </td>
                      <td className="p-3 text-center">
                        <span
                          className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md ${
                            inv.balanceDue <= 0
                              ? "bg-emerald-100 text-emerald-800"
                              : inv.depositPaid > 0
                              ? "bg-amber-100 text-amber-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {inv.balanceDue <= 0 ? "PAID" : inv.depositPaid > 0 ? "PARTIAL" : "UNPAID"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

function LoadingIndicator() {
  return (
    <div className="h-full w-full flex flex-col items-center justify-center gap-3 text-slate-400 font-sans">
      <FiLoader className="animate-spin text-[#128C7E]" size={32} />
      <p className="text-xs font-extrabold uppercase tracking-widest text-slate-500">
        Loading Financial Analytics...
      </p>
    </div>
  );
}

export default function Dashboard() {
  return (
    <Suspense fallback={<LoadingIndicator />}>
      <DashboardContent />
    </Suspense>
  );
}