import React, { useState, useEffect } from "react";
import { FiPlus, FiChevronLeft, FiChevronRight, FiAlertTriangle, FiX } from "react-icons/fi";
import { FaTrash, FaPen } from "react-icons/fa6";

export default function ShowCustomer({ 
  selectedCustomer, 
  handleOpenAddModal, 
  handleOpenEditModal // Optional handler if passing EditMeasurement modal directly
}) {
  const [measurementsList, setMeasurementsList] = useState(
    selectedCustomer?.measurements || []
  );
  const [itemPage, setItemPage] = useState(1);
  const itemsPerPageSide = 4;

  // Confirmation Popup Modal State
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Keep local measurements synchronized with incoming selected customer prop
  useEffect(() => {
    setMeasurementsList(selectedCustomer?.measurements || []);
    setItemPage(1); // Reset to page 1 on client change
  }, [selectedCustomer?.id, selectedCustomer?.measurements]);

  const totalItemsCount = measurementsList.length;
  const totalPages = Math.ceil(totalItemsCount / itemsPerPageSide) || 1;

  // Slice measurements array for current page
  const currentItemsSlice = measurementsList.slice(
    (itemPage - 1) * itemsPerPageSide,
    itemPage * itemsPerPageSide
  );

  // Trigger Confirmation Modal
  const promptDelete = (id) => {
    setDeleteTargetId(id);
  };

  // Perform Delete Action after user clicks "Yes"
  const confirmDelete = async () => {
    if (!deleteTargetId) return;
    setIsDeleting(true);

    try {
      const res = await fetch(`/api/measurements/${deleteTargetId}`, { 
        method: "DELETE" 
      });
      
      if (res.ok) {
        const updated = measurementsList.filter((m) => m.id !== deleteTargetId);
        setMeasurementsList(updated);

        // Adjust current page if last item on page was deleted
        const newTotalPages = Math.ceil(updated.length / itemsPerPageSide) || 1;
        if (itemPage > newTotalPages) {
          setItemPage(newTotalPages);
        }
      }
    } catch (err) {
      console.error("Failed to delete measurement record", err);
    } finally {
      setIsDeleting(false);
      setDeleteTargetId(null);
    }
  };

  // Handle Edit click
  const onEditClick = (measurement) => {
    if (handleOpenEditModal) {
      handleOpenEditModal(measurement);
    } else {
      // Fallback: use existing handleOpenAddModal passing existing customer details
      handleOpenAddModal(selectedCustomer, measurement);
    }
  };

  return (
    <>
      {/* Header Info */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            {selectedCustomer.fullName}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Phone: {selectedCustomer.phone}{" "}
            {selectedCustomer.email && `| Email: ${selectedCustomer.email}`}
          </p>
          {selectedCustomer.notes && (
            <p className="text-xs text-slate-600 italic mt-1 bg-slate-50 p-2 rounded-lg border border-slate-100">
              Note: {selectedCustomer.notes}
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={() => handleOpenAddModal(selectedCustomer)}
          className="flex items-center gap-1 text-xs font-bold text-[#128C7E] bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100 hover:bg-emerald-100 transition-colors cursor-pointer"
        >
          <FiPlus /> New Fit Record
        </button>
      </div>

      {/* Saved Category Measurements */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-xs font-extrabold uppercase text-slate-400 tracking-wider">
            Measurement History ({totalItemsCount})
          </h3>

          {/* Quick Header Pagination Controls */}
          {totalItemsCount > itemsPerPageSide && (
            <div className="flex items-center gap-2 text-[11px] font-bold text-slate-500">
              <span>
                {itemPage} / {totalPages}
              </span>
              <div className="flex gap-0.5">
                <button
                  type="button"
                  disabled={itemPage === 1}
                  onClick={() => setItemPage((p) => Math.max(p - 1, 1))}
                  className="p-1 border border-slate-200 rounded hover:bg-slate-50 disabled:opacity-40 transition cursor-pointer disabled:cursor-not-allowed"
                  title="Previous Page"
                >
                  <FiChevronLeft size={12} />
                </button>
                <button
                  type="button"
                  disabled={itemPage >= totalPages}
                  onClick={() => setItemPage((p) => Math.min(p + 1, totalPages))}
                  className="p-1 border border-slate-200 rounded hover:bg-slate-50 disabled:opacity-40 transition cursor-pointer disabled:cursor-not-allowed"
                  title="Next Page"
                >
                  <FiChevronRight size={12} />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Measurement Grid */}
        <div className="space-y-2 min-h-fit">
          {totalItemsCount === 0 ? (
            <p className="text-xs text-slate-400 italic py-8 text-center border border-dashed border-slate-200 rounded-xl">
              No measurement records stored for this client yet.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentItemsSlice.map((m) => (
                <div
                  key={m.id}
                  className="bg-slate-50/70 p-4 rounded-2xl border border-slate-200/80 space-y-3"
                >
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <span className="text-xs font-black uppercase text-[#128C7E]">
                      {m.categoryName}
                    </span>
                    <div className="flex items-center gap-2.5">
                      <span className="text-[10px] text-slate-400 font-medium">
                        {new Date(m.createdAt).toLocaleDateString()}
                      </span>

                      {/* Edit Button */}
                      <button
                        type="button"
                        onClick={() => onEditClick(m)}
                        className="text-slate-400 hover:text-[#128C7E] transition-colors cursor-pointer p-1"
                        title="Edit Record"
                      >
                        <FaPen className="h-3 w-3" />
                      </button>

                      {/* Delete Button */}
                      <button
                        type="button"
                        onClick={() => promptDelete(m.id)}
                        className="text-slate-400 hover:text-red-500 transition-colors cursor-pointer p-1"
                        title="Delete Record"
                      >
                        <FaTrash className="h-3 w-3" />
                      </button>
                    </div>
                  </div>

                  {/* Size Parameters Key-Value Grid */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {Object.entries(m.details || {}).map(([key, val]) => (
                      <div
                        key={key}
                        className="flex justify-between bg-white px-2.5 py-1.5 rounded-lg border border-slate-100"
                      >
                        <span className="text-slate-500 font-medium truncate pr-1">
                          {key}:
                        </span>
                        <span className="font-bold text-slate-800 whitespace-nowrap">
                          {val || "--"} in
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bottom Dots & Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between pt-2 border-t border-slate-100">
            <button
              type="button"
              disabled={itemPage === 1}
              onClick={() => setItemPage((p) => Math.max(p - 1, 1))}
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
                  onClick={() => setItemPage(i + 1)}
                  className={`h-1.5 rounded-full transition-all cursor-pointer ${
                    itemPage === i + 1
                      ? "w-4 bg-[#128C7E]"
                      : "w-1.5 bg-slate-300 hover:bg-slate-400"
                  }`}
                  aria-label={`Go to page ${i + 1}`}
                />
              ))}
            </div>

            <button
              type="button"
              disabled={itemPage >= totalPages}
              onClick={() => setItemPage((p) => Math.min(p + 1, totalPages))}
              className="px-2.5 py-1 text-[11px] font-bold rounded-lg border border-slate-200 text-slate-600 bg-slate-50 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* REAL CONFIRMATION POPUP MODAL */}
      {deleteTargetId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200 font-sans">
          <div className="bg-white max-w-sm w-full rounded-2xl p-6 shadow-2xl border border-slate-100 space-y-4 text-center relative">
            
            <button
              type="button"
              onClick={() => setDeleteTargetId(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-lg"
            >
              <FiX className="h-4 w-4" />
            </button>

            <div className="w-12 h-12 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto">
              <FiAlertTriangle className="h-6 w-6" />
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-black text-slate-900">
                Delete Measurement Entry?
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Are you sure you want to delete this measurement record? This action cannot be undone.
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteTargetId(null)}
                disabled={isDeleting}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50 transition-colors cursor-pointer"
              >
                No, Keep It
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                disabled={isDeleting}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md transition-all active:scale-[0.98] disabled:opacity-50 cursor-pointer"
              >
                {isDeleting ? "Deleting..." : "Yes, Delete"}
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}