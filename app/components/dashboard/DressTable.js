import React from "react";
import { FaTrash, FaEye, FaTag, FaClock, FaPen } from "react-icons/fa6";

export default function DressTable({
  handleDeleteDress,
  handleOpenEdit,
  handleSelectDress,
  loading,
  filteredDresses,
  selected,
}) {
  return (
    <>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-slate-100 text-slate-400 font-extrabold text-[11px] uppercase tracking-wider bg-slate-50/90 sticky top-0 backdrop-blur-md z-10">
            <th className="p-3.5">Outfit</th>
            <th className="p-3.5">Category</th>
            <th className="p-3.5">Price</th>
            <th className="p-3.5">Views</th>
            <th className="p-3.5">Completion</th>
            <th className="p-3.5 text-right">Actions</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
          {loading ? (
            <tr>
              <td
                colSpan={6}
                className="p-12 text-center text-slate-400 font-bold animate-pulse"
              >
                Loading Outfit Inventory...
              </td>
            </tr>
          ) : filteredDresses.length === 0 ? (
            <tr>
              <td colSpan={6} className="p-12 text-center">
                <div className="bg-slate-50 p-8 rounded-2xl border border-dashed border-slate-200 space-y-2 max-w-sm mx-auto">
                  <div className="w-10 h-10 bg-emerald-100 text-[#128C7E] rounded-full flex items-center justify-center mx-auto">
                    <FaTag className="h-5 w-5" />
                  </div>
                  <h3 className="font-bold text-slate-800 text-sm">
                    No outfits found
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Try adjusting your category filter or search keywords.
                  </p>
                </div>
              </td>
            </tr>
          ) : (
            filteredDresses.map((dress) => {
              const isSelected = selected?.id === dress.id;
              return (
                <tr
                  key={dress.id}
                  onClick={() => handleSelectDress(dress)}
                  className={`cursor-pointer transition-colors ${
                    isSelected
                      ? "bg-emerald-50/70 border-l-4 border-[#128C7E]"
                      : "hover:bg-slate-50/80"
                  }`}
                >
                  {/* Image & Title */}
                  <td className="p-3.5">
                    <div className="flex items-center gap-3">
                      <img
                        src={
                          dress.images?.[0] ||
                          "https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?w=600"
                        }
                        alt={dress.title}
                        className="w-11 h-11 rounded-xl object-cover border border-slate-200 shadow-sm flex-shrink-0"
                      />
                      <div>
                        <h4 className="font-bold text-slate-900 text-xs line-clamp-1">
                          {dress.title}
                        </h4>
                        <span className="text-[10px] text-slate-400 font-mono">
                          ID: {dress.id?.slice(0, 8)}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="p-3.5 font-bold text-slate-600">
                    <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md text-[11px]">
                      {dress.category?.name || "General"}
                    </span>
                  </td>

                  {/* Price */}
                  <td className="p-3.5 font-black text-slate-900">
                    {dress.price
                      ? `₦${dress.price.toLocaleString()}`
                      : "Free Quote"}
                  </td>

                  {/* Views */}
                  <td className="p-3.5 text-slate-500">
                    <span className="inline-flex items-center gap-1 bg-slate-100 px-2 py-1 rounded-md text-[11px] font-bold">
                      <FaEye className="text-[#128C7E]" /> {dress.views || 0}
                    </span>
                  </td>

                  {/* Completion Time */}
                  <td className="p-3.5 text-slate-500 font-medium">
                    <span className="inline-flex items-center gap-1 text-[11px]">
                      <FaClock className="text-slate-400" />
                      {dress.completionTime || "5-7 days"}
                    </span>
                  </td>

                  {/* Actions (Edit & Delete) */}
                  <td className="p-3.5 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        type="button"
                        onClick={(e) => handleOpenEdit(e, dress)}
                        className="p-2 text-slate-400 hover:text-[#128C7E] hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                        title="Edit Outfit"
                      >
                        <FaPen className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => handleDeleteDress(e, dress.id)}
                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                        title="Delete Outfit"
                      >
                        <FaTrash className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </>
  );
}