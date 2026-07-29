"use client";
import { useState, useEffect } from "react";
import { FiX, FiImage, FiPackage, FiUploadCloud, FiTrash2 } from "react-icons/fi";

export default function CreateDress({ setAddDress }) {
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  // Form State
  const [form, setForm] = useState({
    title: "",
    categoryId: "",
    price: "",
    completionTime: "5 - 7 working days",
    description: "",
  });

  // Array of image data URLs or links (up to 4)
  const [imagePreviews, setImagePreviews] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Slide Animation State
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Trigger right-to-left slide-in animation on mount
    setMounted(true);

    async function loadCategories() {
      try {
        const res = await fetch("/api/categories");
        if (res.ok) {
          const data = await res.json();
          setCategories(data.categories || []);
          if (data.categories?.length > 0) {
            setForm((prev) => ({ ...prev, categoryId: data.categories[0].id }));
          }
        }
      } catch (err) {
        console.error("Failed to load categories", err);
      } finally {
        setLoadingCategories(false);
      }
    }
    loadCategories();
  }, []);

  const handleClose = () => {
    setMounted(false);
    setTimeout(() => {
      setAddDress(false);
    }, 300); // Match animation duration
  };

  // Process Local Computer Files & Read as Base64 Data URLs
  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    if (imagePreviews.length + files.length > 4) {
      setError("You can upload a maximum of 4 images per outfit.");
      return;
    }

    setError("");

    files.forEach((file) => {
      if (!file.type.startsWith("image/")) {
        setError("Please select valid image files.");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews((prev) => {
          if (prev.length >= 4) return prev;
          return [...prev, reader.result];
        });
      };
      reader.readAsDataURL(file);
    });
  };

  // Remove a specific image preview
  const removeImage = (indexToRemove) => {
    setImagePreviews((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccess("");

    if (imagePreviews.length === 0) {
      setError("Please select at least 1 image for this outfit.");
      setSubmitting(false);
      return;
    }

    try {
      const res = await fetch("/api/dresses/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title,
          categoryId: form.categoryId,
          price: form.price,
          completionTime: form.completionTime,
          description: form.description,
          images: imagePreviews,
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed to add dress");

      setSuccess("Dress added to catalogue!");
      setTimeout(() => {
        handleClose();
        window.location.reload();
      }, 1200);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm overflow-hidden font-sans">
      {/* Click outside backdrop to close */}
      <div className="absolute inset-0" onClick={handleClose} />

      {/* Slide-Over Drawer Container */}
      <div
        className={`
          relative w-full max-w-lg bg-white h-full shadow-2xl flex flex-col justify-between
          transform transition-transform duration-300 ease-in-out z-10
          ${mounted ? "translate-x-0" : "translate-x-full"}
        `}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/80">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-100 text-[#128C7E] rounded-xl">
              <FiPackage className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-extrabold text-slate-800 text-base">Add New Outfit</h2>
              <p className="text-[11px] text-slate-500">Upload design details to your catalogue</p>
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

        {/* Form Body */}
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

          {/* Outfit Title */}
          <div>
            <label className="block text-xs font-bold uppercase text-slate-700 tracking-wide mb-1">
              Outfit Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Royal Emerald Agbada"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-xs text-black placeholder:text-slate-400 outline-none focus:border-[#128C7E] focus:ring-1 focus:ring-[#128C7E]"
            />
          </div>

          {/* Category Dropdown */}
          <div>
            <label className="block text-xs font-bold uppercase text-slate-700 tracking-wide mb-1">
              Category *
            </label>
            {loadingCategories ? (
              <div className="text-xs text-slate-400 py-2">Loading categories...</div>
            ) : categories.length === 0 ? (
              <div className="text-xs text-red-500 py-2">No categories found. Create one first!</div>
            ) : (
              <select
                value={form.categoryId}
                onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-xs text-black outline-none focus:border-[#128C7E] focus:ring-1 focus:ring-[#128C7E] bg-white cursor-pointer"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Price & Completion */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 tracking-wide mb-1">
                Price (₦)
              </label>
              <input
                type="number"
                placeholder="e.g. 120000"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-xs text-black placeholder:text-slate-400 outline-none focus:border-[#128C7E] focus:ring-1 focus:ring-[#128C7E]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 tracking-wide mb-1">
                Completion Time
              </label>
              <input
                type="text"
                placeholder="e.g. 5 - 7 working days"
                value={form.completionTime}
                onChange={(e) => setForm({ ...form, completionTime: e.target.value })}
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-xs text-black placeholder:text-slate-400 outline-none focus:border-[#128C7E] focus:ring-1 focus:ring-[#128C7E]"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold uppercase text-slate-700 tracking-wide mb-1">
              Description
            </label>
            <textarea
              rows="3"
              placeholder="Mention fabric details, embroidery patterns, accessories included..."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-xs text-black placeholder:text-slate-400 outline-none focus:border-[#128C7E] focus:ring-1 focus:ring-[#128C7E]"
            />
          </div>

          {/* Computer Local Image Upload Section */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold uppercase text-slate-700 tracking-wide flex items-center gap-1.5">
                <FiImage className="text-[#128C7E]" /> Select Images ({imagePreviews.length}/4)
              </label>
              <span className="text-[10px] text-slate-400">Max 4 images</span>
            </div>

            {/* Drop Zone / Select Button */}
            {imagePreviews.length < 4 && (
              <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-300 hover:border-[#128C7E] bg-slate-50/50 hover:bg-emerald-50/30 rounded-2xl p-5 cursor-pointer transition-colors group">
                <FiUploadCloud className="h-8 w-8 text-slate-400 group-hover:text-[#128C7E] transition-colors" />
                <span className="mt-2 text-xs font-bold text-slate-700">Click to choose photos from computer</span>
                <span className="text-[10px] text-slate-400 mt-0.5">PNG, JPG, WEBP formats</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </label>
            )}

            {/* Image Previews Grid */}
            {imagePreviews.length > 0 && (
              <div className="grid grid-cols-2 gap-3 pt-2">
                {imagePreviews.map((preview, idx) => (
                  <div
                    key={idx}
                    className="relative group rounded-xl overflow-hidden border border-slate-200 aspect-square shadow-sm bg-slate-100"
                  >
                    <img
                      src={preview}
                      alt={`Outfit Preview ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="absolute top-2 right-2 bg-red-600 text-white p-1.5 rounded-full shadow-md opacity-90 hover:opacity-100 transition-opacity cursor-pointer"
                      aria-label="Remove image"
                    >
                      <FiTrash2 className="h-3.5 w-3.5" />
                    </button>
                    {idx === 0 && (
                      <span className="absolute bottom-2 left-2 text-[9px] font-extrabold uppercase bg-[#128C7E] text-white px-2 py-0.5 rounded-md shadow">
                        Primary Image
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
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
            disabled={submitting || categories.length === 0}
            className="px-6 py-2.5 rounded-xl bg-[#128C7E] hover:bg-[#0e6d62] text-white font-bold text-xs shadow-md transition-all active:scale-[0.98] disabled:opacity-50 cursor-pointer"
          >
            {submitting ? "Saving Outfit..." : "Save Outfit"}
          </button>
        </div>
      </div>
    </div>
  );
}