"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import {
  FiMenu,
  FiLogOut,
  FiHome,
  FiUsers,
  FiPlus,
  FiPackage,
  FiX,
  FiTrendingUp,
} from "react-icons/fi";

import CreateCatalogue from "./CreateCatalogue";
import AddDress from "./CreateDress";
import AddMeasurement from "./AddMeasurement";

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

export default function Nav({ collapsed, setCollapsed }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileActionMenu, setMobileActionMenu] = useState(false);
  const [addDress, setAddDress] = useState(false);
  const [createCatalogue, setCreateCatalogue] = useState(false);
  const [addMeasurement, setAddMeasurement] = useState(false);

  // Default state for AddMeasurement form
  const [navCustomerForm, setNavCustomerForm] = useState({
    fullName: "",
    phone: "",
    email: "",
    notes: "",
  });
  const [navSelectedCategory, setNavSelectedCategory] = useState("Senator");
  const [navMeasurementValues, setNavMeasurementValues] = useState({});

  // Dynamic Profile State from Database
  const [profile, setProfile] = useState({
    businessName: "StyleThread Tailor",
    logoUrl: "",
    tagline: "Master Tailor",
  });
  const [loggingOut, setLoggingOut] = useState(false);

  const pathname = usePathname();
  const router = useRouter();

  // Load Tailor Profile Details from DB
  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await fetch("/api/profile");
        if (res.ok) {
          const data = await res.json();
          if (data.tailor) {
            setProfile({
              businessName: data.tailor.businessName,
              logoUrl: data.tailor.logoUrl || "",
              tagline: data.tailor.tagline || "Master Tailor",
            });
          }
        }
      } catch (err) {
        console.error("Failed to load nav profile", err);
      }
    }
    loadProfile();
  }, []);

  // Handle Logout Action
  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      const res = await fetch("/api/auth/logout", {
        method: "POST",
      });

      if (res.ok) {
        router.push("/login");
        router.refresh();
      }
    } catch (err) {
      console.error("Logout error", err);
    } finally {
      setLoggingOut(false);
    }
  };

  const menuItems = [
    {
      title: "Dashboard",
      icon: <FiHome size={20} />,
      href: "/dashboard",
    },
    {
      title: "Dresses",
      icon: <FiPackage size={20} />,
      href: "/dashboard/dresses",
    },
    {
      title: "Measurements",
      icon: <FiUsers size={20} />,
      href: "/dashboard/measurement",
    },
    {
      title: "Profile",
      icon: <FiTrendingUp size={20} />,
      href: "/dashboard/profile",
    },
  ];

  const handleNavCategoryChange = (cat) => {
    setNavSelectedCategory(cat);
    const initial = {};
    CATEGORY_FIELDS[cat]?.forEach((field) => {
      initial[field] = "";
    });
    setNavMeasurementValues(initial);
  };

  const handleNavMeasurementSubmit = async (e) => {
    e?.preventDefault();
    try {
      const res = await fetch("/api/measurements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: navCustomerForm.fullName,
          phone: navCustomerForm.phone,
          email: navCustomerForm.email,
          notes: navCustomerForm.notes,
          categoryName: navSelectedCategory,
          details: navMeasurementValues,
        }),
      });

      if (res.ok) {
        setAddMeasurement(false);
        window.location.reload();
      }
    } catch (err) {
      console.error("Failed to save measurement from Nav", err);
    }
  };

  return (
    <>
      {/* Mobile Top Header Bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-14 bg-zinc-950/90 border-b border-zinc-800 px-4 flex items-center justify-between z-40 backdrop-blur-md">
       
        <span className="text-xs font-black tracking-widest text-[#25D366] uppercase">
          {profile.businessName}
        </span>
        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className="text-zinc-400 p-2 hover:text-red-400 transition-colors"
          title="Logout"
        >
          <FiLogOut size={18} />
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Desktop & Mobile Drawer Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-screen bg-zinc-950 text-white border-r border-zinc-800
          shadow-2xl z-50 flex flex-col justify-between
          transition-all duration-300 ease-in-out
          ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          ${collapsed ? "lg:w-20" : "lg:w-64"}
          w-72
        `}
      >
        <div className="flex flex-col flex-1 min-h-0">
          {/* Sidebar Header */}
          <div className="h-16 px-4 border-b border-zinc-800 flex items-center justify-between flex-shrink-0">
            {(!collapsed || mobileOpen) && (
              <h1 className="text-lg font-black tracking-wider text-white flex items-center gap-1.5">
                STYLE<span className="text-[#25D366]">THREAD</span>
              </h1>
            )}

            <div className="flex items-center gap-2 ml-auto">
              <button
                onClick={() => setCollapsed(!collapsed)}
                className="hidden lg:flex p-2 rounded-lg hover:bg-zinc-900 text-zinc-400 hover:text-[#25D366] transition-colors"
              >
                <FiMenu size={20} />
              </button>

              <button
                onClick={() => setMobileOpen(false)}
                className="lg:hidden p-2 rounded-lg hover:bg-zinc-900 text-zinc-400 hover:text-red-400"
              >
                <FiX size={20} />
              </button>
            </div>
          </div>

          {/* Profile Header Section */}
          {(!collapsed || mobileOpen) && (
            <div className="flex flex-col items-center pt-6 pb-4 px-4 border-b border-zinc-800/50">
              <div className="w-20 h-20 bg-zinc-800 rounded-full overflow-hidden mb-3 p-1 border border-[#128C7E] shadow-md flex items-center justify-center">
                {profile.logoUrl ? (
                  <img
                    src={profile.logoUrl}
                    alt={profile.businessName}
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <div className="w-full h-full bg-[#128C7E] text-white flex items-center justify-center font-black text-2xl rounded-full">
                    {profile.businessName ? profile.businessName[0] : "T"}
                  </div>
                )}
              </div>

              <h2 className="text-sm font-bold text-white tracking-wide text-center truncate w-full">
                {profile.businessName}
              </h2>

              <div className="mt-1.5 px-3 py-0.5 bg-[#128C7E]/20 text-[11px] font-semibold text-[#25D366] rounded-full border border-[#128C7E]/40 truncate max-w-full">
                {profile.tagline}
              </div>
            </div>
          )}

          {/* Navigation Items */}
          <nav className="flex-1 p-3 space-y-6 overflow-y-auto">
            <div className="space-y-1">
              {menuItems.map((item) => {
                const isActive =
                  item.href === "/dashboard"
                    ? pathname === "/dashboard"
                    : pathname.startsWith(item.href);

                return (
                  <Link
                    key={item.title}
                    href={item.href}
                    onClick={() => {
                      setAddDress(false);
                      setCreateCatalogue(false);
                      setMobileOpen(false);
                      setAddMeasurement(false);
                    }}
                    className={`
                      flex items-center justify-between
                      px-3 py-3 rounded-xl
                      transition-all duration-200 group
                      ${
                        isActive
                          ? "bg-[#128C7E] text-white font-semibold shadow-lg shadow-[#128C7E]/20"
                          : "text-zinc-400 hover:bg-zinc-900 hover:text-white"
                      }
                    `}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span
                        className={`${
                          isActive ? "text-white" : "text-zinc-400 group-hover:text-[#25D366]"
                        } transition-colors flex-shrink-0`}
                      >
                        {item.icon}
                      </span>

                      {(!collapsed || mobileOpen) && (
                        <span className="font-medium text-sm truncate">
                          {item.title}
                        </span>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Quick Actions Component Tree */}
            <div>
              {(!collapsed || mobileOpen) && (
                <p className="text-[10px] font-extrabold uppercase tracking-widest text-zinc-500 mb-2 px-3">
                  Quick Actions
                </p>
              )}

              <div className="space-y-1">
                <button
                  onClick={() => {
                    setAddDress(true);
                    setCreateCatalogue(false);
                    setMobileOpen(false);
                    setAddMeasurement(false);
                  }}
                  className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-zinc-400 hover:bg-zinc-900 hover:text-white transition-all duration-200 group cursor-pointer"
                >
                  <FiPlus
                    size={20}
                    className="text-zinc-400 group-hover:text-[#25D366] flex-shrink-0"
                  />
                  {(!collapsed || mobileOpen) && (
                    <span className="font-medium text-sm">Add New Dress</span>
                  )}
                </button>

                <button
                  onClick={() => {
                    setCreateCatalogue(true);
                    setAddDress(false);
                    setMobileOpen(false);
                    setAddMeasurement(false);
                  }}
                  className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-zinc-400 hover:bg-zinc-900 hover:text-white transition-all duration-200 group cursor-pointer"
                >
                  <FiPlus
                    size={20}
                    className="text-zinc-400 group-hover:text-[#25D366] flex-shrink-0"
                  />
                  {(!collapsed || mobileOpen) && (
                    <span className="font-medium text-sm font-sans">Add Category</span>
                  )}
                </button>

                <button
                  onClick={() => {
                    setCreateCatalogue(false);
                    setAddDress(false);
                    setMobileOpen(false);
                    setAddMeasurement(true);
                  }}
                  className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-zinc-400 hover:bg-zinc-900 hover:text-white transition-all duration-200 group cursor-pointer"
                >
                  <FiPlus
                    size={20}
                    className="text-zinc-400 group-hover:text-[#25D366] flex-shrink-0"
                  />
                  {(!collapsed || mobileOpen) && (
                    <span className="font-medium text-sm font-sans">Add Measurement</span>
                  )}
                </button>
              </div>
            </div>
          </nav>
        </div>

        {/* Logout Button */}
        <div className="p-3 border-t border-zinc-800 bg-zinc-950/50 flex-shrink-0">
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-zinc-400 hover:bg-red-950/30 hover:text-red-400 transition-all duration-200 cursor-pointer group disabled:opacity-50"
          >
            <FiLogOut
              size={20}
              className="text-zinc-400 group-hover:text-red-400 flex-shrink-0"
            />
            {(!collapsed || mobileOpen) && (
              <span className="font-medium text-sm">
                {loggingOut ? "Logging out..." : "Logout"}
              </span>
            )}
          </button>
        </div>
      </aside>

      {/* MOBILE WHATSAPP-STYLE BOTTOM NAVIGATION BAR */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-zinc-950/95 border-t border-zinc-800 backdrop-blur-md z-40 flex items-center justify-around px-2">
        {/* Dashboard Tab */}
        <Link
          href="/dashboard"
          onClick={() => setMobileActionMenu(false)}
          className={`flex flex-col items-center justify-center gap-0.5 flex-1 h-full text-[10px] font-bold ${
            pathname === "/dashboard" ? "text-[#25D366]" : "text-zinc-400"
          }`}
        >
          <FiHome size={20} />
          <span>Home</span>
        </Link>

        {/* Dresses Tab */}
        <Link
          href="/dashboard/dresses"
          onClick={() => setMobileActionMenu(false)}
          className={`flex flex-col items-center justify-center gap-0.5 flex-1 h-full text-[10px] font-bold ${
            pathname.startsWith("/dashboard/dresses") ? "text-[#25D366]" : "text-zinc-400"
          }`}
        >
          <FiPackage size={20} />
          <span>Dresses</span>
        </Link>

        {/* Quick Action FAB (+) */}
        <div className="relative flex-1 flex items-center justify-center h-full">
          <button
            type="button"
            onClick={() => setMobileActionMenu(!mobileActionMenu)}
            className={`w-12 h-12 rounded-full flex items-center justify-center text-white shadow-lg transition-transform active:scale-95 ${
              mobileActionMenu ? "bg-red-600 rotate-45" : "bg-[#128C7E]"
            }`}
          >
            <FiPlus size={24} />
          </button>
        </div>

        {/* Measurements Tab */}
        <Link
          href="/dashboard/measurement"
          onClick={() => setMobileActionMenu(false)}
          className={`flex flex-col items-center justify-center gap-0.5 flex-1 h-full text-[10px] font-bold ${
            pathname.startsWith("/dashboard/measurement") ? "text-[#25D366]" : "text-zinc-400"
          }`}
        >
          <FiUsers size={20} />
          <span>Fits</span>
        </Link>

        {/* Profile Tab */}
        <Link
          href="/dashboard/profile"
          onClick={() => setMobileActionMenu(false)}
          className={`flex flex-col items-center justify-center gap-0.5 flex-1 h-full text-[10px] font-bold ${
            pathname.startsWith("/dashboard/profile") ? "text-[#25D366]" : "text-zinc-400"
          }`}
        >
          <FiTrendingUp size={20} />
          <span>Profile</span>
        </Link>
      </div>

      {/* MOBILE QUICK ACTION POPUP MENU */}
      {mobileActionMenu && (
        <>
          <div
            className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-xs z-30"
            onClick={() => setMobileActionMenu(false)}
          />
          <div className="lg:hidden fixed bottom-20 left-1/2 -translate-x-1/2 bg-zinc-900 border border-zinc-800 rounded-2xl p-3 shadow-2xl z-40 w-64 space-y-2 animate-in fade-in zoom-in-95 duration-200">
            <p className="text-[10px] font-extrabold uppercase text-zinc-500 tracking-wider text-center border-b border-zinc-800 pb-2">
              Quick Actions
            </p>
            <button
              type="button"
              onClick={() => {
                setAddDress(true);
                setMobileActionMenu(false);
              }}
              className="w-full text-left px-3 py-2 text-xs font-bold text-white bg-zinc-800 hover:bg-[#128C7E] rounded-xl transition-colors flex items-center gap-2 cursor-pointer"
            >
              <FiPlus size={16} className="text-[#25D366]" /> Add New Dress
            </button>
            <button
              type="button"
              onClick={() => {
                setCreateCatalogue(true);
                setMobileActionMenu(false);
              }}
              className="w-full text-left px-3 py-2 text-xs font-bold text-white bg-zinc-800 hover:bg-[#128C7E] rounded-xl transition-colors flex items-center gap-2 cursor-pointer"
            >
              <FiPlus size={16} className="text-[#25D366]" /> Add Category
            </button>
            <button
              type="button"
              onClick={() => {
                setAddMeasurement(true);
                setMobileActionMenu(false);
              }}
              className="w-full text-left px-3 py-2 text-xs font-bold text-white bg-zinc-800 hover:bg-[#128C7E] rounded-xl transition-colors flex items-center gap-2 cursor-pointer"
            >
              <FiPlus size={16} className="text-[#25D366]" /> Add Measurement
            </button>
          </div>
        </>
      )}

      {/* Modals View Overlays */}
      {addDress && <AddDress setAddDress={setAddDress} />}
      {createCatalogue && (
        <CreateCatalogue setCreateCatalogue={setCreateCatalogue} />
      )}
      {addMeasurement && (
        <AddMeasurement
          setOpenModal={setAddMeasurement}
          customerForm={navCustomerForm}
          setCustomerForm={setNavCustomerForm}
          selectedCategory={navSelectedCategory}
          handleCategoryChange={handleNavCategoryChange}
          CATEGORY_FIELDS={CATEGORY_FIELDS}
          measurementValues={navMeasurementValues}
          setMeasurementValues={setNavMeasurementValues}
          handleSubmit={handleNavMeasurementSubmit}
        />
      )}
    </>
  );
}