"use client";

import { useState, useEffect } from "react";
import {
  FiSave,
  FiUploadCloud,
  FiUser,
  FiMapPin,
  FiPhone,
  FiGlobe,
  FiImage,
  FiCheck,
  FiExternalLink,
  FiLoader,
} from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa6";

// Force Next.js App Router dynamic execution (Prevents build-time static render errors)
export const dynamic = "force-dynamic";

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({
    businessName: "",
    tagline: "",
    bio: "",
    email: "",
    slug: "",
    phone: "",
    whatsapp: "",
    location: "",
    logoUrl: "",
    heroBgUrl: "",
  });

  // Fetch Existing Profile Info safely
  useEffect(() => {
    if (typeof window === "undefined") return;

    async function loadProfile() {
      try {
        const res = await fetch("/api/profile", { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          const t = data.tailor;
          if (t) {
            setForm({
              businessName: t.businessName || "",
              tagline: t.tagline || "",
              bio: t.bio || "",
              email: t.email || "",
              slug: t.slug || "",
              phone: t.phone || "",
              whatsapp: t.whatsapp || "",
              location: t.location || "",
              logoUrl: t.logoUrl || "",
              heroBgUrl: t.heroBgUrl || "",
            });
          }
        }
      } catch (err) {
        console.error("Failed to load profile details", err);
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, []);

  // Handle Image File Selection from Computer (Logo or Banner)
  const handleImageFile = (e, field) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setForm((prev) => ({ ...prev, [field]: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed to update profile.");

      setSuccess("Profile settings saved successfully!");
      setTimeout(() => setSuccess(""), 4000);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 p-8 flex flex-col items-center justify-center gap-3 text-slate-400 font-sans">
        <FiLoader className="animate-spin text-[#128C7E]" size={28} />
        <p className="text-xs font-bold uppercase tracking-widest text-slate-500">
          Loading Profile Configuration...
        </p>
      </div>
    );
  }

  const publicUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/t/${form.slug}`
      : `http://localhost:3000/t/${form.slug}`;

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div>
            <h1 className="text-2xl font-black text-slate-900">Brand Settings</h1>
            <p className="text-xs text-slate-500 mt-1">
              Customize your business logo, banner, bio, and contact information.
            </p>
          </div>
          <a
            href={publicUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 text-xs font-bold text-[#128C7E] bg-emerald-50 px-4 py-2.5 rounded-xl border border-emerald-100 hover:bg-emerald-100 transition-colors w-fit"
          >
            <FiGlobe /> Preview Public Storefront <FiExternalLink />
          </a>
        </div>

        {/* Alerts */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-2xl text-xs font-semibold">
            {error}
          </div>
        )}

        {success && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-[#128C7E] rounded-2xl text-xs font-semibold flex items-center gap-2">
            <FiCheck className="h-4 w-4" /> {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* SECTION 1: VISUAL BRANDING (BANNER & LOGO) */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6">
            <h2 className="text-sm font-extrabold uppercase tracking-wide text-slate-800 flex items-center gap-2">
              <FiImage className="text-[#128C7E]" /> Storefront Visuals
            </h2>

            {/* Hero Banner Upload */}
            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 tracking-wide mb-2">
                Hero Background Banner
              </label>
              <div className="relative h-44 rounded-2xl overflow-hidden border border-slate-200 bg-slate-900 group">
                <img
                  src={
                    form.heroBgUrl ||
                    "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=1200&q=80"
                  }
                  alt="Banner Preview"
                  className="w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity"
                />
                <label className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer text-white">
                  <FiUploadCloud className="h-8 w-8 drop-shadow-md" />
                  <span className="text-xs font-bold mt-1 drop-shadow-md">
                    Change Hero Banner
                  </span>
                  <span className="text-[10px] text-slate-300">Recommended size: 1200x400</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageFile(e, "heroBgUrl")}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Brand Logo Upload */}
            <div className="flex flex-col sm:flex-row items-center gap-6 pt-2">
              <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-[#128C7E] shadow-md bg-slate-100 flex-shrink-0">
                {form.logoUrl ? (
                  <img
                    src={form.logoUrl}
                    alt="Logo Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-[#128C7E] text-white flex items-center justify-center text-3xl font-black">
                    {form.businessName ? form.businessName[0] : "T"}
                  </div>
                )}
              </div>

              <div className="space-y-2 text-center sm:text-left">
                <h3 className="text-sm font-bold text-slate-800">Company Logo / Profile Avatar</h3>
                <p className="text-xs text-slate-500">
                  Displayed on your public header and client order messages.
                </p>
                <label className="inline-flex items-center gap-2 bg-slate-900 text-white text-xs font-bold px-4 py-2 rounded-xl cursor-pointer hover:bg-slate-800 transition-colors">
                  <FiUploadCloud /> Upload New Logo
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageFile(e, "logoUrl")}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>

          {/* SECTION 2: COMPANY INFORMATION */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
            <h2 className="text-sm font-extrabold uppercase tracking-wide text-slate-800 flex items-center gap-2">
              <FiUser className="text-[#128C7E]" /> Business Details
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 tracking-wide mb-1">
                  Business / Brand Name *
                </label>
                <input
                  type="text"
                  required
                  value={form.businessName}
                  onChange={(e) => setForm({ ...form, businessName: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-xs text-black placeholder:text-slate-400 outline-none focus:border-[#128C7E] focus:ring-1 focus:ring-[#128C7E]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 tracking-wide mb-1">
                  Tagline / Motto
                </label>
                <input
                  type="text"
                  placeholder="e.g. Bespoke Tailoring & Luxury Fabrics"
                  value={form.tagline}
                  onChange={(e) => setForm({ ...form, tagline: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-xs text-black placeholder:text-slate-400 outline-none focus:border-[#128C7E] focus:ring-1 focus:ring-[#128C7E]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 tracking-wide mb-1">
                Store Bio / About Us
              </label>
              <textarea
                rows="3"
                placeholder="Share your experience, specialties (e.g. Agbada, Senators, Wedding suits)..."
                value={form.bio}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-xs text-black placeholder:text-slate-400 outline-none focus:border-[#128C7E] focus:ring-1 focus:ring-[#128C7E]"
              />
            </div>
          </div>

          {/* SECTION 3: CONTACT & LOCATION */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
            <h2 className="text-sm font-extrabold uppercase tracking-wide text-slate-800 flex items-center gap-2">
              <FiPhone className="text-[#128C7E]" /> Contact & Reachability
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 tracking-wide mb-1 flex items-center gap-1">
                  <FaWhatsapp className="text-[#25D366]" /> WhatsApp Number (with country code) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="2348075608069"
                  value={form.whatsapp}
                  onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-xs text-black placeholder:text-slate-400 outline-none focus:border-[#128C7E] focus:ring-1 focus:ring-[#128C7E]"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Do not add + or spaces (e.g. 2348075608069)
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 tracking-wide mb-1">
                  Direct Phone Call Line
                </label>
                <input
                  type="text"
                  placeholder="+2348075608069"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-xs text-black placeholder:text-slate-400 outline-none focus:border-[#128C7E] focus:ring-1 focus:ring-[#128C7E]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 tracking-wide mb-1 flex items-center gap-1">
                <FiMapPin className="text-[#128C7E]" /> Workshop / Shop Location
              </label>
              <input
                type="text"
                placeholder="e.g. Ikeja, Lagos, Nigeria"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-xs text-black placeholder:text-slate-400 outline-none focus:border-[#128C7E] focus:ring-1 focus:ring-[#128C7E]"
              />
            </div>
          </div>

          {/* SAVE BUTTON */}
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 bg-[#128C7E] hover:bg-[#0e6d62] text-white font-bold text-sm px-8 py-3.5 rounded-xl shadow-lg transition-all active:scale-[0.98] disabled:opacity-50 cursor-pointer"
            >
              <FiSave className="h-4 w-4" /> {saving ? "Saving Changes..." : "Save Profile Settings"}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}