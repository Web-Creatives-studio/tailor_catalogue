"use client";
import React, { useState, useEffect } from "react";
import { FiX } from "react-icons/fi";
import { FaPen } from "react-icons/fa6";

export default function EditMeasurement({
  measurement,
  setOpenEditModal,
  onMeasurementUpdated,
  CATEGORY_FIELDS,
}) {
  const [mounted, setMounted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [selectedCategory, setSelectedCategory] = useState(
    measurement?.categoryName || "Senator"
  );
  
  const [customerForm, setCustomerForm] = useState({
    fullName: measurement?.customer?.fullName || "",
    phone: measurement?.customer?.phone || "",
    email: measurement?.customer?.email || "",
    notes: measurement?.customer?.notes || "",
  });

  const [measurementValues, setMeasurementValues] = useState(
    measurement?.details || {}
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleClose = () => {
    setMounted(false);
    setTimeout(() => {
      setOpenEditModal(false);
    }, 300);
  };

  const handleCategoryChange = (cat) => {
    setSelectedCategory(cat);
    // If switching to a new category, preserve matching keys or initialize empty strings
    const initial = {};
    CATEGORY_FIELDS[cat]?.forEach((field) => {
      initial[field] = measurementValues[field] || "";
    });
    setMeasurementValues(initial);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch(`/api/measurements/${measurement.id}`, {
        method: "PUT",
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

      if (!res.ok) throw new Error(data.error || "Failed to update measurement.");

      setSuccess("Measurement record updated!");

      if (onMeasurementUpdated) {
        onMeasurementUpdated(data.measurement || data.customer);
      }

      setTimeout(() => {
        handleClose();
      }, 1000);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm overflow-hidden font-sans">
      {/* Click backdrop to close */}
      <div className="absolute inset-0" onClick={handleClose} />

      {/* Slide-over Panel from Right */}
      <div
        className={`
          relative w-full max-w-lg bg-white h-full shadow-2xl flex flex-col justify-between
          transform transition-transform duration-300 ease-in-out z-10
          ${mounted ? "translate-x-0" : "translate-x-full"}
        `}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/80">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-100 text-[#128C7E] rounded-xl">
              <FaPen className="h-4 w-4" />
            </div>
            <div>
              <h2 className="font-extrabold text-slate-800 text-base">Edit Measurement Entry</h2>
              <p className="text-[11px] text-slate-500">Update client details or fit parameters</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-200/60 transition-colors cursor-pointer"
          >
            <FiX className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Form Content */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-xs font-semibold text-center">
              {error}
            </div>
          )}

          {success && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-[#128C7E] rounded-xl text-xs font-semibold text-center">
              {success}
            </div>
          )}

          {/* Client Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 tracking-wide mb-1">
                Client Full Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Chief Adeleke"
                value={customerForm.fullName}
                onChange={(e) =>
                  setCustomerForm({ ...customerForm, fullName: e.target.value })
                }
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-xs text-black placeholder:text-slate-400 outline-none focus:border-[#128C7E] focus:ring-1 focus:ring-[#128C7E]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 tracking-wide mb-1">
                Phone Number *
              </label>
              <input
                type="text"
                required
                placeholder="08012345678"
                value={customerForm.phone}
                onChange={(e) =>
                  setCustomerForm({ ...customerForm, phone: e.target.value })
                }
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-xs text-black placeholder:text-slate-400 outline-none focus:border-[#128C7E] focus:ring-1 focus:ring-[#128C7E]"
              />
            </div>
          </div>

          {/* Email & Notes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 tracking-wide mb-1">
                Email Address
              </label>
              <input
                type="email"
                placeholder="client@example.com"
                value={customerForm.email}
                onChange={(e) =>
                  setCustomerForm({ ...customerForm, email: e.target.value })
                }
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-xs text-black placeholder:text-slate-400 outline-none focus:border-[#128C7E] focus:ring-1 focus:ring-[#128C7E]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 tracking-wide mb-1">
                Special Notes
              </label>
              <input
                type="text"
                placeholder="e.g. Prefers extra sleeve room"
                value={customerForm.notes}
                onChange={(e) =>
                  setCustomerForm({ ...customerForm, notes: e.target.value })
                }
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-xs text-black placeholder:text-slate-400 outline-none focus:border-[#128C7E] focus:ring-1 focus:ring-[#128C7E]"
              />
            </div>
          </div>

          {/* Category Selector */}
          <div>
            <label className="block text-xs font-bold uppercase text-slate-700 tracking-wide mb-1.5">
              Outfit Category *
            </label>
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
              {CATEGORY_FIELDS &&
                Object.keys(CATEGORY_FIELDS).map((cat) => (
                  <button
                    type="button"
                    key={cat}
                    onClick={() => handleCategoryChange(cat)}
                    className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
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

          {/* Dynamic Category Input Fields */}
          <div className="space-y-3 pt-3 border-t border-slate-100">
            <label className="block text-xs font-bold uppercase text-slate-700 tracking-wide">
              {selectedCategory} Size Parameters (Inches)
            </label>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {CATEGORY_FIELDS &&
                CATEGORY_FIELDS[selectedCategory]?.map((param) => (
                  <div key={param}>
                    <span className="block text-[11px] font-semibold text-slate-600 mb-1">
                      {param}
                    </span>
                    <input
                      type="text"
                      placeholder="e.g. 42"
                      value={measurementValues[param] || ""}
                      onChange={(e) =>
                        setMeasurementValues({
                          ...measurementValues,
                          [param]: e.target.value,
                        })
                      }
                      className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs text-black placeholder:text-slate-400 outline-none focus:border-[#128C7E] focus:ring-1 focus:ring-[#128C7E]"
                    />
                  </div>
                ))}
            </div>
          </div>
        </form>

        {/* Footer Actions */}
        <div className="p-5 border-t border-slate-100 bg-white flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={handleClose}
            className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-600 font-semibold text-xs hover:bg-slate-50 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={saving}
            className="px-6 py-2.5 rounded-xl bg-[#128C7E] hover:bg-[#0e6d62] text-white font-bold text-xs shadow-md transition-all active:scale-[0.98] disabled:opacity-50 cursor-pointer"
          >
            {saving ? "Updating..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}