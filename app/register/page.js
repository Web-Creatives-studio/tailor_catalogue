"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaGoogle, FaShirt } from "react-icons/fa6";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    businessName: "",
    email: "",
    password: "",
    phone: "",
    whatsapp: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to register account.");
      }

      // Redirect to tailor dashboard on success
      router.push("/login");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-slate-50">
      
      {/* Left Branding / Promo Banner */}
      <div className="hidden lg:flex flex-col justify-between bg-slate-900 text-white p-12 relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=1200&q=80')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/80 to-transparent" />

        <div className="relative z-10">
          <div className="flex items-center gap-2 text-[#25D366]">
            <FaShirt className="h-7 w-7" />
            <span className="font-extrabold text-2xl tracking-tight text-white">StyleThread</span>
          </div>
        </div>

        <div className="relative z-10 max-w-md space-y-4">
          <h1 className="text-4xl font-black leading-tight">
            Give your tailoring brand a modern home.
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed">
            Create an instant, shareable catalogue link for your clients. Show off your bestSenator, Agbada, and Gown styles without clogging up WhatsApp phone storage.
          </p>
        </div>

        <div className="relative z-10 text-xs text-slate-500">
          © {new Date().getFullYear()} StyleThread SaaS. All rights reserved.
        </div>
      </div>

      {/* Right Registration Form */}
      <div className="flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-12">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="text-center text-3xl font-extrabold text-slate-900 tracking-tight">
            Create your catalogue
          </h2>
          <p className="mt-2 text-center text-sm text-slate-600">
            Start organizing your designs in minutes
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-6 sm:px-10 shadow-sm rounded-2xl border border-slate-200">
            
            {/* Error Message Alert */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-xs font-semibold text-center">
                {error}
              </div>
            )}

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 tracking-wide mb-1">
                  Business Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kora Couture"
                  className="block w-full text-black rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm shadow-sm focus:border-[#128C7E] focus:outline-none focus:ring-1 focus:ring-[#128C7E]"
                  value={form.businessName}
                  onChange={(e) =>
                    setForm({ ...form, businessName: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 tracking-wide mb-1">
                  Email address
                </label>
                <input
                  type="email"
                  required
                  placeholder="tailor@example.com"
                  className="block w-full text-black rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm shadow-sm focus:border-[#128C7E] focus:outline-none focus:ring-1 focus:ring-[#128C7E]"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 tracking-wide mb-1">
                  Password
                </label>
                <input
                  type="password"
                  required
                  placeholder="At least 6 characters"
                  className="block w-full text-black rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm shadow-sm focus:border-[#128C7E] focus:outline-none focus:ring-1 focus:ring-[#128C7E]"
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 tracking-wide mb-1">
                  WhatsApp Number (with country code)
                </label>
                <input
                  type="tel"
                  placeholder="2348075608069"
                  required
                  className="block w-full text-black rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm shadow-sm focus:border-[#128C7E] focus:outline-none focus:ring-1 focus:ring-[#128C7E]"
                  value={form.whatsapp}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      whatsapp: e.target.value,
                      phone: e.target.value,
                    })
                  }
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 rounded-xl text-white bg-[#128C7E] hover:bg-[#0e6d62] font-bold text-sm shadow-md transition-all active:scale-[0.99] disabled:opacity-50"
              >
                {loading ? "Creating Account..." : "Create Account"}
              </button>

           

            
            </form>

            <div className="mt-6 text-center text-xs text-slate-500">
              Already have an account?{" "}
              <Link href="/login" className="text-[#128C7E] font-bold hover:underline">
                Log in
              </Link>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}