"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaGoogle, FaShirt } from "react-icons/fa6";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to log in.");
      }

      // Redirect to tailor dashboard on success
      router.push("/dashboard");
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
            Welcome back to your workspace.
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed">
            Manage your style listings, view catalogue engagement, update prices, and streamline WhatsApp orders for your business.
          </p>
        </div>

        <div className="relative z-10 text-xs text-slate-500">
          © {new Date().getFullYear()} StyleThread SaaS. All rights reserved.
        </div>
      </div>

      {/* Right Login Form */}
      <div className="flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-12">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="text-center text-3xl font-extrabold text-slate-900 tracking-tight">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-slate-600">
            Access your tailor dashboard & catalogue links
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-6 sm:px-10 shadow-sm rounded-2xl border border-slate-200">
            
            {/* Error Alert */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-xs font-semibold text-center">
                {error}
              </div>
            )}

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 tracking-wide mb-1">
                  Email address
                </label>
                <input
                  type="email"
                  required
                  placeholder="tailor@example.com"
                  className="block w-full rounded-xl text-black border border-slate-300 px-3.5 py-2.5 text-sm shadow-sm focus:border-[#128C7E] focus:outline-none focus:ring-1 focus:ring-[#128C7E]"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold uppercase text-slate-700 tracking-wide">
                    Password
                  </label>
                  <Link href="#" className="text-xs font-semibold text-[#128C7E] hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  className="block w-full text-black rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm shadow-sm focus:border-[#128C7E] focus:outline-none focus:ring-1 focus:ring-[#128C7E]"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 rounded-xl text-white bg-[#128C7E] hover:bg-[#0e6d62] font-bold text-sm shadow-md transition-all active:scale-[0.99] disabled:opacity-50"
              >
                {loading ? "Signing in..." : "Log In"}
              </button>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-slate-400 font-bold">Or continue with</span>
                </div>
              </div>

              <div>
                <button
                  type="button"
                  className="w-full flex items-center justify-center gap-2 border border-slate-300 bg-white py-2.5 px-4 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm"
                >
                  <FaGoogle className="text-red-500 h-4 w-4" /> Google
                </button>
              </div>
            </form>

            <div className="mt-6 text-center text-xs text-slate-500">
              Don't have an account yet?{" "}
              <Link href="/register" className="text-[#128C7E] font-bold hover:underline">
                Create Account
              </Link>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}