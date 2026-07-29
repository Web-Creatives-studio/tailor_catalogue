"use client";

import React, { useState, useEffect, Suspense } from "react";
import { FiPlus, FiSearch, FiPhone, FiLoader } from "react-icons/fi";
import { FaRuler } from "react-icons/fa6";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import AddMeasurement from "@/app/components/dashboard/AddMeasurement";
import EditMeasurement from "@/app/components/dashboard/EditMeasurement";
import ShowCustomer from "@/app/components/dashboard/ShowCustomer";

// Force dynamic execution for safe database/API query environments during build
export const dynamic = "force-dynamic";

// Category Measurement Templates
const CATEGORY_FIELDS = {
  Senator: [
    "Neck",
    "Chest",
    "Shoulder",
    "Sleeve Length",
    "Top Length",
    "Trouser Length",
    "Waist",
    "Thigh",
    "Ankle",
  ],
  Agbada: [
    "Agbada Length",
    "Shoulder to Wrist",
    "Inner Shirt Chest",
    "Neck",
    "Trouser Length",
    "Waist",
  ],
  Suit: [
    "Chest",
    "Waist (Jacket)",
    "Shoulder",
    "Sleeve Length",
    "Jacket Length",
    "Trouser Waist",
    "Trouser Length",
    "Thigh",
  ],
  Shirt: [
    "Neck",
    "Chest",
    "Shoulder",
    "Sleeve Length",
    "Shirt Length",
    "Wrist Cuff",
  ],
  Trouser: [
    "Waist",
    "Hip",
    "Thigh",
    "Knee",
    "Ankle / Bottom",
    "Trouser Length",
    "Inseam",
  ],
  "Street Wear": [
    "Chest / Bust",
    "Shoulder",
    "Top Length",
    "Hip",
    "Waist",
    "Shorts / Pant Length",
  ],
};

// 1. Core Component carrying useSearchParams logic
function MeasurementPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // URL Parameters State Synchronization
  const urlCustomerId = searchParams.get("customerId") || "";

  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Add Modal State
  const [openModal, setOpenModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("Senator");
  const [measurementValues, setMeasurementValues] = useState({});

  // Edit Modal State
  const [openEditModal, setOpenEditModal] = useState(false);
  const [editingMeasurement, setEditingMeasurement] = useState(null);

  const [customerForm, setCustomerForm] = useState({
    fullName: "",
    phone: "",
    email: "",
    notes: "",
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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

  // Load Customers & Measurements
  useEffect(() => {
    if (typeof window === "undefined") return;

    async function loadMeasurements() {
      try {
        const res = await fetch("/api/measurements", { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          setCustomers(data.customers || []);
        }
      } catch (err) {
        console.error("Failed to fetch measurements", err);
      } finally {
        setLoading(false);
      }
    }
    loadMeasurements();
  }, []);

  // Update measurement input fields when category switches in Add Modal
  const handleCategoryChange = (cat) => {
    setSelectedCategory(cat);
    const initial = {};
    CATEGORY_FIELDS[cat]?.forEach((field) => {
      initial[field] = "";
    });
    setMeasurementValues(initial);
  };

  // Open modal for NEW measurement entry
  const handleOpenAddModal = (existingCustomer = null) => {
    if (existingCustomer) {
      setCustomerForm({
        fullName: existingCustomer.fullName || "",
        phone: existingCustomer.phone || "",
        email: existingCustomer.email || "",
        notes: existingCustomer.notes || "",
      });
    } else {
      setCustomerForm({ fullName: "", phone: "", email: "", notes: "" });
    }

    handleCategoryChange("Senator");
    setError("");
    setSuccess("");
    setOpenModal(true);
  };

  // Open modal for EDITING existing measurement entry with pre-filled details
  const handleOpenEditModal = (measurement) => {
    setEditingMeasurement({
      ...measurement,
      customer: selectedCustomer,
    });
    setOpenEditModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch("/api/measurements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: customerForm.fullName,
          phone: customerForm.phone,
          email: customerForm.email,
          notes: customerForm.notes,
          categoryName: selectedCategory,
          details: measurementValues,
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed to save measurement.");

      setSuccess("Measurement record saved!");
      setTimeout(() => {
        setOpenModal(false);
        window.location.reload();
      }, 1000);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const filteredCustomers = customers.filter(
    (c) =>
      c.fullName?.toLowerCase().includes(search.toLowerCase()) ||
      c.phone?.includes(search)
  );

  // Synchronize active client profile strictly with URL parameter
  const selectedCustomer =
    customers.find((c) => String(c.id) === String(urlCustomerId)) ||
    filteredCustomers[0] ||
    null;

  if (loading) {
    return <LoadingIndicator />;
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Customer Search & Sidebar List */}
          <div className="relative bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col min-h-[650px]">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-4">
              <div>
                <h1 className="text-2xl font-black text-slate-900">
                  Client Measurements
                </h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  Store and manage customer size profiles per clothing category.
                </p>
              </div>
            </div>

            <div className="p-4 border-b border-slate-100 bg-slate-50/50">
              <div className="relative">
                <FiSearch className="absolute left-3.5 top-3 text-slate-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search by name or phone..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-xs text-black placeholder:text-slate-400 rounded-xl border border-slate-200 outline-none focus:border-[#128C7E]"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
              {filteredCustomers.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400">
                  No clients found. Click "+" to add your first client.
                </div>
              ) : (
                filteredCustomers.map((cust) => (
                  <div
                    key={cust.id}
                    onClick={() => handleUrlParamChange("customerId", cust.id)}
                    className={`p-4 cursor-pointer transition-colors flex items-center justify-between ${
                      selectedCustomer?.id === cust.id
                        ? "bg-emerald-50/60 border-l-4 border-[#128C7E]"
                        : "hover:bg-slate-50"
                    }`}
                  >
                    <div>
                      <h3 className="font-bold text-xs text-slate-800">
                        {cust.fullName}
                      </h3>
                      <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                        <FiPhone className="h-3 w-3" /> {cust.phone}
                      </p>
                    </div>
                    <span className="text-[10px] font-extrabold bg-slate-100 px-2 py-1 rounded-md text-slate-600">
                      {cust.measurements?.length || 0} records
                    </span>
                  </div>
                ))
              )}
            </div>

            <div className="absolute bottom-4 right-4 z-10">
              <button
                type="button"
                onClick={() => handleOpenAddModal()}
                className="flex items-center justify-center bg-[#128C7E] hover:bg-[#0e6d62] text-white font-bold p-4 rounded-full shadow-lg transition-all active:scale-[0.98] cursor-pointer"
                title="Add New Measurement"
              >
                <FiPlus className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Customer Detailed Records Panel */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-6 min-h-[660px] border-t-4 border-t-[#128C7E]">
            {selectedCustomer ? (
              <ShowCustomer
                selectedCustomer={selectedCustomer}
                handleOpenAddModal={handleOpenAddModal}
                handleOpenEditModal={handleOpenEditModal}
              />
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 py-20 space-y-2">
                <FaRuler className="h-10 w-10 text-slate-300" />
                <p className="text-xs font-bold">
                  Select a client from the list to inspect measurements.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ADD NEW MEASUREMENT MODAL */}
      {openModal && (
        <AddMeasurement
          setOpenModal={setOpenModal}
          handleSubmit={handleSubmit}
          success={success}
          error={error}
          customerForm={customerForm}
          setCustomerForm={setCustomerForm}
          selectedCategory={selectedCategory}
          handleCategoryChange={handleCategoryChange}
          CATEGORY_FIELDS={CATEGORY_FIELDS}
          measurementValues={measurementValues}
          setMeasurementValues={setMeasurementValues}
          saving={saving}
        />
      )}

      {/* EDIT EXISTING MEASUREMENT MODAL */}
      {openEditModal && editingMeasurement && (
        <EditMeasurement
          measurement={editingMeasurement}
          setOpenEditModal={setOpenEditModal}
          CATEGORY_FIELDS={CATEGORY_FIELDS}
          onMeasurementUpdated={() => {
            window.location.reload();
          }}
        />
      )}
    </div>
  );
}

// 2. Extracted Loading UI for clean Suspense fallback usage
function LoadingIndicator() {
  return (
    <div className="h-[80vh] w-full flex flex-col items-center justify-center gap-3 text-slate-400 font-sans">
      <FiLoader className="animate-spin text-[#128C7E]" size={28} />
      <p className="text-xs font-bold uppercase tracking-widest text-slate-500">
        Loading Client Measurements...
      </p>
    </div>
  );
}

// 3. Default Export wrapped inside Suspense to pass builds seamlessly
export default function MeasurementPage() {
  return (
    <Suspense fallback={<LoadingIndicator />}>
      <MeasurementPageContent />
    </Suspense>
  );
}