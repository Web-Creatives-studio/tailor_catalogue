"use client";
import React, { useState, useEffect } from "react";
import { FiX, FiTag } from "react-icons/fi";

export default function CreateCatalogue({ setCreateCatalogue }) {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Slide Animation State
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Trigger right-to-left slide-in animation on mount
    setMounted(true);
  }, []);

  const handleClose = () => {
    setMounted(false);
    setTimeout(() => {
      setCreateCatalogue(false);
    }, 300); // Matches transition duration
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed to create category");

      setSuccess("Category created successfully!");
      setName("");
      setTimeout(() => {
        handleClose();
        window.location.reload(); // Refresh data state
      }, 1000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm overflow-hidden font-sans">
      {/* Click backdrop to close */}
      <div className="absolute inset-0" onClick={handleClose} />

      {/* Slide-over Panel Container */}
      <div
        className={`
          relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between
          transform transition-transform duration-300 ease-in-out z-10
          ${mounted ? "translate-x-0" : "translate-x-full"}
        `}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/80">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-100 text-[#128C7E] rounded-xl">
              <FiTag className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-extrabold text-slate-800 text-base">Create New Category</h2>
              <p className="text-[11px] text-slate-500">Organize your designs into distinct outfit styles</p>
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

        {/* Drawer Form Body */}
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

          <div>
            <label className="block text-xs font-bold uppercase text-slate-700 tracking-wide mb-1.5">
              Category Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Agbada, Senator Wear, Corporate Suits"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-xs text-black placeholder:text-slate-400 outline-none focus:border-[#128C7E] focus:ring-1 focus:ring-[#128C7E]"
            />
          </div>
        </form>

        {/* Drawer Footer Actions */}
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
            disabled={loading}
            className="px-6 py-2.5 rounded-xl bg-[#128C7E] hover:bg-[#0e6d62] text-white font-bold text-xs shadow-md transition-all active:scale-[0.98] disabled:opacity-50 cursor-pointer"
          >
            {loading ? "Saving Category..." : "Save Category"}
          </button>
        </div>
      </div>
    </div>
  );
}