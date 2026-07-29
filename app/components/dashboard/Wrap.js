"use client";

import React, { useState } from "react";
import Nav from "./Nav";

export default function Wrap({ children }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50 font-sans">
      {/* Sidebar navigation component (includes mobile top & bottom navs) */}
      <Nav collapsed={collapsed} setCollapsed={setCollapsed} />

      {/* Main Content Viewport */}
      <main
        className={`
          flex-1 
          h-full 
          overflow-y-auto 
          px-4 sm:px-6 lg:px-8 
          pt-10 lg:pt-0
          pb-20 lg:pb-0
          transition-all duration-300 ease-in-out
          ${collapsed ? "lg:pl-20" : "lg:pl-64"}
        `}
      >
        {children}
      </main>
    </div>
  );
}