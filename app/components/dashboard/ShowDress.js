"use client";
import React, { useState, useEffect } from "react";
import { FaPen, FaRuler } from "react-icons/fa6";

export default function ShowDress({ selected, handleOpenEdit }) {
  const [currentImgPage, setCurrentImgPage] = useState(1);
  const IMAGES_PER_PAGE = 2; // Show 2 images per page in the 2-column grid

  // Reset page to 1 whenever selected dress changes
  useEffect(() => {
    setCurrentImgPage(1);
  }, [selected?.id]);

  if (!selected) return null;

  return (
    <>
      <div className="space-y-4">
        {/* Header Badge */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <span className="text-[10px] uppercase font-extrabold text-[#128C7E] tracking-wider bg-emerald-50 px-2.5 py-1 rounded-md">
            {selected.category?.name || "General"}
          </span>
          <div className="flex items-center gap-2">
            <span className="text-xs font-extrabold text-slate-900">
              {selected.price
                ? `₦${selected.price.toLocaleString()}`
                : "Price on Request"}
            </span>
            <button
              type="button"
              onClick={(e) => handleOpenEdit(e, selected)}
              className="p-1.5 bg-slate-100 text-slate-600 rounded-lg hover:bg-[#128C7E] hover:text-white transition-colors cursor-pointer"
              title="Edit Outfit"
            >
              <FaPen className="h-3 w-3" />
            </button>
          </div>
        </div>

        {/* Primary Image Preview Grid */}
        {selected.images &&
          selected.images.length > 0 &&
          (() => {
            const totalPages = Math.ceil(
              selected.images.length / IMAGES_PER_PAGE
            );
            const startIndex = (currentImgPage - 1) * IMAGES_PER_PAGE;
            const currentImages = selected.images.slice(
              startIndex,
              startIndex + IMAGES_PER_PAGE
            );

            return (
              <div className="space-y-2.5">
                {/* Header with Counter */}
                <div className="flex items-center justify-between">
                  <h3 className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                    Design Images ({selected.images.length})
                  </h3>
                  {totalPages > 1 && (
                    <span className="text-[10px] font-bold text-slate-500">
                      Page {currentImgPage} of {totalPages}
                    </span>
                  )}
                </div>

                {/* Grid showing only current page images */}
                <div className="grid grid-cols-2 gap-2.5">
                  {currentImages.map((img, idx) => {
                    const globalIdx = startIndex + idx;
                    return (
                      <div
                        key={globalIdx}
                        className="bg-slate-100 rounded-xl overflow-hidden border border-slate-200 aspect-square relative shadow-xs group"
                      >
                        <img
                          src={
                            img ||
                            "https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?w=600"
                          }
                          alt={`${selected.title} preview ${globalIdx + 1}`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    );
                  })}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between pt-1">
                    <button
                      type="button"
                      disabled={currentImgPage === 1}
                      onClick={() =>
                        setCurrentImgPage((prev) => Math.max(prev - 1, 1))
                      }
                      className="px-2.5 py-1 text-[11px] font-bold rounded-lg border border-slate-200 text-slate-600 bg-slate-50 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
                    >
                      Previous
                    </button>

                    {/* Dots Indicator */}
                    <div className="flex items-center gap-1">
                      {Array.from({ length: totalPages }).map((_, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setCurrentImgPage(i + 1)}
                          className={`h-1.5 rounded-full transition-all cursor-pointer ${
                            currentImgPage === i + 1
                              ? "w-4 bg-[#128C7E]"
                              : "w-1.5 bg-slate-300 hover:bg-slate-400"
                          }`}
                          aria-label={`Go to page ${i + 1}`}
                        />
                      ))}
                    </div>

                    <button
                      type="button"
                      disabled={currentImgPage === totalPages}
                      onClick={() =>
                        setCurrentImgPage((prev) =>
                          Math.min(prev + 1, totalPages)
                        )
                      }
                      className="px-2.5 py-1 text-[11px] font-bold rounded-lg border border-slate-200 text-slate-600 bg-slate-50 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
                    >
                      Next
                    </button>
                  </div>
                )}
              </div>
            );
          })()}

        {/* Details Section */}
        <div className="space-y-3 pt-2">
          <div>
            <h2 className="text-base font-black text-slate-900 leading-tight">
              {selected.title}
            </h2>
          </div>

          <hr className="border-slate-100" />

          <div>
            <h3 className="text-[10px] font-bold uppercase text-slate-400 mb-1 tracking-wider">
              Design Description
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
              {selected.description ||
                "No description provided for this outfit design."}
            </p>
          </div>

        </div>
      </div>
    </>
  );
}