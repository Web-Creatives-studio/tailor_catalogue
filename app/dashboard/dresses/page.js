"use client";

import React, { useState, useEffect, Suspense } from "react";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { FiPackage, FiArrowLeft, FiLoader } from "react-icons/fi";
import EditDress from "@/app/components/dashboard/EditDress";
import DressTable from "@/app/components/dashboard/DressTable";
import ShowDress from "@/app/components/dashboard/ShowDress";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

// Force dynamic execution for safe database/API query environments during build
export const dynamic = "force-dynamic";

// 1. Core Component carrying useSearchParams logic
function DressPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Unified Source of Truth directly from URL Parameter Matrix
  const urlCategory = searchParams.get("category") || "All";
  const urlDressId = searchParams.get("dressId") || "";

  const [dresses, setDresses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Edit State
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    title: "",
    price: "",
    completionTime: "",
    description: "",
    categoryId: "",
  });

  // Helper function to generate consistent tracking URL changes
  const createQueryString = (name, value) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value) {
      params.set(name, String(value));
    } else {
      params.delete(name);
    }

    return params.toString();
  };

  const handleUrlParamChange = (name, value) => {
    const queryString = createQueryString(name, value);
    router.push(`${pathname}?${queryString}`, { scroll: false });
  };

  const handleBackToList = () => {
    handleUrlParamChange("dressId", "");
  };

  useEffect(() => {
    if (typeof window === "undefined") return;

    async function loadData() {
      try {
        const [dressRes, catRes] = await Promise.all([
          fetch("/api/dresses", { cache: "no-store" }),
          fetch("/api/categories", { cache: "no-store" }),
        ]);

        if (dressRes.ok) {
          const data = await dressRes.json();
          const list = data.dresses || [];
          setDresses(list);
        }

        if (catRes.ok) {
          const catData = await catRes.json();
          setCategories(catData.categories || []);
        }
      } catch (err) {
        console.error("Error loading inventory data", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Filtered Dresses calculation based on search and URL category parameter
  const filteredDresses = dresses.filter((dress) => {
    const matchesCategory =
      urlCategory === "All" ||
      dress.category?.name?.toLowerCase() === urlCategory.toLowerCase();
    const matchesSearch =
      dress.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dress.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Synchronize active selected dress strictly with URL parameter
  const selected = urlDressId
    ? dresses.find((d) => String(d.id) === String(urlDressId)) || null
    : null;

  const handleSelectDress = (dress) => {
    handleUrlParamChange("dressId", dress.id);
  };

  const handleDeleteDress = async (e, id) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this outfit listing?")) return;

    try {
      const res = await fetch(`/api/dresses/${id}`, { method: "DELETE" });
      if (res.ok) {
        const updated = dresses.filter((d) => d.id !== id);
        setDresses(updated);
        if (selected?.id === id) {
          handleUrlParamChange("dressId", "");
        }
      }
    } catch (err) {
      console.error("Failed to delete dress", err);
    }
  };

  // Open Edit Modal with prefilled values
  const handleOpenEdit = (e, dress) => {
    e.stopPropagation();
    setEditForm({
      title: dress.title || "",
      price: dress.price || "",
      completionTime: dress.completionTime || "5 - 7 working days",
      description: dress.description || "",
      categoryId: dress.categoryId || categories[0]?.id || "",
    });
    handleUrlParamChange("dressId", dress.id);
    setEditModalOpen(true);
  };

  if (loading) {
    return <LoadingIndicator />;
  }

  return (
    <div className="h-full flex flex-col font-sans overflow-hidden py-6">
      <div className="max-w-7xl w-full mx-auto space-y-4 flex flex-col flex-1 min-h-0 h-full">
        
        {/* Header & Category Filters Bar */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-100 shadow-sm flex-shrink-0 space-y-3">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Outfit Inventory
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Inspect design specs, edit details, and filter by category
              </p>
            </div>
            <span className="text-xs font-extrabold bg-emerald-50 text-[#128C7E] px-3.5 py-1.5 rounded-xl border border-emerald-100/80">
              {filteredDresses.length} Outfits Showing
            </span>
          </div>

          {/* Search Input & Category Filter Chips */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2 border-t border-slate-100">
            {/* Search Input */}
            <div className="relative flex-1">
              <FaMagnifyingGlass className="absolute left-3.5 top-3 text-slate-400 h-3.5 w-3.5" />
              <input
                type="text"
                placeholder="Search by outfit title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs text-black placeholder:text-slate-400 outline-none focus:border-[#128C7E] transition-colors"
              />
            </div>

            {/* Category Filter Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
              <button
                type="button"
                onClick={() => handleUrlParamChange("category", "All")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  urlCategory === "All"
                    ? "bg-[#128C7E] text-white shadow-sm"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                All Categories
              </button>

              {categories.map((cat) => (
                <button
                  type="button"
                  key={cat.id}
                  onClick={() => handleUrlParamChange("category", cat.name)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                    urlCategory.toLowerCase() === cat.name.toLowerCase()
                      ? "bg-[#128C7E] text-white shadow-sm"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Master-Detail Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-stretch flex-1 min-h-0 h-full overflow-hidden">
          
          {/* Left Table Area */}
          {/* Mobile view: Hidden if an outfit is selected */}
          <div
            className={`
              lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col h-full min-h-0
              ${urlDressId ? "hidden lg:flex" : "flex"}
            `}
          >
            <div className="overflow-y-auto flex-1 min-h-0">
              <DressTable
                handleDeleteDress={handleDeleteDress}
                handleOpenEdit={handleOpenEdit}
                handleSelectDress={handleSelectDress}
                loading={loading}
                filteredDresses={filteredDresses}
                selected={selected}
              />
            </div>
          </div>

          {/* Right Detail Card */}
          {/* Mobile view: Shown only if an outfit is selected */}
          <div
            className={`
              lg:col-span-1 bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex flex-col h-full min-h-0 overflow-y-auto space-y-4
              ${urlDressId ? "block" : "hidden lg:block"}
            `}
          >
            {/* WhatsApp-Style Mobile Back Button */}
            {selected && (
              <div className="lg:hidden pb-2 border-b border-slate-100">
                <button
                  type="button"
                  onClick={handleBackToList}
                  className="inline-flex items-center gap-2 text-xs font-bold text-[#128C7E] hover:text-[#0e6d62] transition-colors"
                >
                  <FiArrowLeft className="h-4 w-4" /> Back to Outfits List
                </button>
              </div>
            )}

            {selected ? (
              <ShowDress selected={selected} handleOpenEdit={handleOpenEdit} />
            ) : (
              <div className="py-20 text-center text-slate-400 space-y-2 my-auto">
                <FiPackage className="h-10 w-10 mx-auto text-slate-300" />
                <p className="text-xs font-bold">
                  Select an outfit from the table to inspect details.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* EDIT DRESS MODAL / DRAWER */}
      {editModalOpen && selected && (
        <EditDress
          dress={selected}
          setEditDress={setEditModalOpen}
          onDressUpdated={(updated) => {
            setDresses((prev) =>
              prev.map((d) => (d.id === updated.id ? updated : d))
            );
          }}
        />
      )}
    </div>
  );
}

// Extracted Loading UI for clean Suspense fallback usage
function LoadingIndicator() {
  return (
    <div className="h-full w-full flex flex-col items-center justify-center gap-3 text-slate-400 font-sans">
      <FiLoader className="animate-spin text-[#128C7E]" size={28} />
      <p className="text-xs font-bold uppercase tracking-widest text-slate-500">
        Hydrating Outfit Inventory...
      </p>
    </div>
  );
}

// Default Export wrapped inside Suspense to pass builds seamlessly
export default function DressPage() {
  return (
    <Suspense fallback={<LoadingIndicator />}>
      <DressPageContent />
    </Suspense>
  );
}