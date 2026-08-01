"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  FiPlus,
  FiChevronLeft,
  FiChevronRight,
  FiAlertTriangle,
  FiX,
  FiFileText,
} from "react-icons/fi";
import { FaTrash, FaPen } from "react-icons/fa6";
import GenerateInvoice from "./GenerateInvoice";

export default function ShowCustomer({
  selectedCustomer,
  handleOpenAddModal,
  handleOpenEditModal,
}) {
  const [measurementsList, setMeasurementsList] = useState(
    selectedCustomer?.measurements || []
  );
  const [invoicesList, setInvoicesList] = useState(
    selectedCustomer?.invoices || []
  );
  const [tailorProfile, setTailorProfile] = useState(null);

  const [openInvoiceModal, setOpenInvoiceModal] = useState(false);
  const [activeTab, setActiveTab] = useState("measurements"); // "measurements" or "invoices"

  const [itemPage, setItemPage] = useState(1);
  const itemsPerPageSide = 2;

  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Sync state with selected customer & load Tailor profile for real branding
  const loadCustomerInvoices = useCallback(async () => {
    if (!selectedCustomer?.id) return;
    try {
      const res = await fetch("/api/invoices", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        // Filter invoices specifically belonging to this customer
        const clientInvoices = (data.invoices || []).filter(
          (inv) => String(inv.customerId) === String(selectedCustomer.id)
        );
        setInvoicesList(clientInvoices);
      }
    } catch (err) {
      console.error("Failed to load customer invoices", err);
    }
  }, [selectedCustomer?.id]);

  useEffect(() => {
    setMeasurementsList(selectedCustomer?.measurements || []);
    setInvoicesList(selectedCustomer?.invoices || []);
    setItemPage(1);

    async function loadTailorProfile() {
      try {
        const res = await fetch("/api/dashboard", { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          setTailorProfile(data.tailor);
        }
      } catch (err) {
        console.error("Failed to load tailor profile", err);
      }
    }

    loadTailorProfile();
    loadCustomerInvoices();
  }, [selectedCustomer?.id, selectedCustomer?.measurements, selectedCustomer?.invoices, loadCustomerInvoices]);

  // Real-Time Customer Financial Calculations
  const totalBilled = invoicesList.reduce(
    (acc, inv) => acc + Number(inv.totalAmount || 0),
    0
  );
  const totalPaid = invoicesList.reduce(
    (acc, inv) => acc + Number(inv.depositPaid || 0),
    0
  );
  const totalOutstanding = totalBilled - totalPaid;

  const totalItemsCount = measurementsList.length;
  const totalPages = Math.ceil(totalItemsCount / itemsPerPageSide) || 1;

  const currentItemsSlice = measurementsList.slice(
    (itemPage - 1) * itemsPerPageSide,
    itemPage * itemsPerPageSide
  );

  const promptDelete = (id) => {
    setDeleteTargetId(id);
  };

  const confirmDelete = async () => {
    if (!deleteTargetId) return;
    setIsDeleting(true);

    try {
      const res = await fetch(`/api/measurements/${deleteTargetId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        const updated = measurementsList.filter((m) => m.id !== deleteTargetId);
        setMeasurementsList(updated);

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

  const onEditClick = (measurement) => {
    if (handleOpenEditModal) {
      handleOpenEditModal(measurement);
    } else {
      handleOpenAddModal(selectedCustomer, measurement);
    }
  };

  return (
    <>
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-100 pb-4 gap-3">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">
            {selectedCustomer.fullName}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Phone: {selectedCustomer.phone}{" "}
            {selectedCustomer.email && `| Email: ${selectedCustomer.email}`}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setOpenInvoiceModal(true)}
            className="flex items-center gap-1.5 text-xs font-extrabold text-slate-800 bg-slate-100 px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-200 transition-all cursor-pointer active:scale-95 shadow-xs"
          >
            <FiFileText className="text-[#128C7E]" /> Create Invoice
          </button>
          <button
            type="button"
            onClick={() => handleOpenAddModal(selectedCustomer)}
            className="flex items-center gap-1.5 text-xs font-extrabold text-white bg-[#128C7E] px-3.5 py-2 rounded-xl hover:bg-[#0e6d62] transition-all cursor-pointer active:scale-95 shadow-xs"
          >
            <FiPlus /> New Fit Record
          </button>
        </div>
      </div>

   

      {/* Tab Controls: Measurements vs Invoices Ledger */}
      <div className="flex border-b border-slate-100 gap-4">
        <button
          type="button"
          onClick={() => setActiveTab("measurements")}
          className={`pb-2 text-xs font-extrabold transition-all border-b-2 cursor-pointer ${
            activeTab === "measurements"
              ? "border-[#128C7E] text-[#128C7E]"
              : "border-transparent text-slate-400 hover:text-slate-600"
          }`}
        >
          Measurement Specs ({totalItemsCount})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("invoices")}
          className={`pb-2 text-xs font-extrabold transition-all border-b-2 cursor-pointer ${
            activeTab === "invoices"
              ? "border-[#128C7E] text-[#128C7E]"
              : "border-transparent text-slate-400 hover:text-slate-600"
          }`}
        >
          Invoice & Payment Ledger ({invoicesList.length})
        </button>
      </div>

      {/* TAB 1: MEASUREMENTS GRID */}
      {activeTab === "measurements" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
              Category Size Parameters
            </h3>

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
                    className="p-1 border border-slate-200 rounded hover:bg-slate-50 disabled:opacity-40 transition cursor-pointer"
                  >
                    <FiChevronLeft size={12} />
                  </button>
                  <button
                    type="button"
                    disabled={itemPage >= totalPages}
                    onClick={() => setItemPage((p) => Math.min(p + 1, totalPages))}
                    className="p-1 border border-slate-200 rounded hover:bg-slate-50 disabled:opacity-40 transition cursor-pointer"
                  >
                    <FiChevronRight size={12} />
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-2 min-h-fit">
            {totalItemsCount === 0 ? (
              <p className="text-xs text-slate-400 italic py-8 text-center border border-dashed border-slate-200 rounded-xl">
                No size parameters stored for this client yet.
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
                        <button
                          type="button"
                          onClick={() => onEditClick(m)}
                          className="text-slate-400 hover:text-[#128C7E] transition-colors p-1"
                        >
                          <FaPen className="h-3 w-3" />
                        </button>
                        <button
                          type="button"
                          onClick={() => promptDelete(m.id)}
                          className="text-slate-400 hover:text-red-500 transition-colors p-1"
                        >
                          <FaTrash className="h-3 w-3" />
                        </button>
                      </div>
                    </div>

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
        </div>
      )}

      {/* TAB 2: INVOICES & PAYMENTS TABLE */}
      {activeTab === "invoices" && (
        <div className="space-y-3">
          {invoicesList.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400 border border-dashed border-slate-200 rounded-2xl space-y-2">
              <FiFileText className="h-8 w-8 mx-auto text-slate-300" />
              <p className="font-bold">No invoices generated for this client yet.</p>
              <button
                type="button"
                onClick={() => setOpenInvoiceModal(true)}
                className="inline-flex items-center gap-1.5 bg-[#128C7E] text-white px-3 py-1.5 rounded-xl font-bold text-xs"
              >
                Create First Invoice
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto border border-slate-200 rounded-2xl">
              <table className="w-full text-left text-xs font-sans">
                <thead className="bg-slate-50 text-slate-500 font-extrabold uppercase text-[10px] border-b border-slate-200">
                  <tr>
                    <th className="p-3">Ref #</th>
                    <th className="p-3">Outfit / Category</th>
                    <th className="p-3 text-center">Qty</th>
                    <th className="p-3 text-right">Total (₦)</th>
                    <th className="p-3 text-right">Paid (₦)</th>
                    <th className="p-3 text-right">Balance (₦)</th>
                    <th className="p-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {invoicesList.map((inv) => (
                    <tr key={inv.id || inv.invoiceNumber} className="hover:bg-slate-50/80">
                      <td className="p-3 font-bold text-slate-900">{inv.invoiceNumber}</td>
                      <td className="p-3">
                        <div className="font-bold text-slate-800">{inv.itemTitle}</div>
                        <div className="text-[10px] text-slate-400">{inv.category}</div>
                      </td>
                      <td className="p-3 text-center font-bold">{inv.quantity || 1}</td>
                      <td className="p-3 text-right font-bold">₦{Number(inv.totalAmount || 0).toLocaleString()}</td>
                      <td className="p-3 text-right font-bold text-[#128C7E]">₦{Number(inv.depositPaid || 0).toLocaleString()}</td>
                      <td className="p-3 text-right font-bold text-red-600">
                        ₦{Number(inv.balanceDue || 0).toLocaleString()}
                      </td>
                      <td className="p-3 text-center">
                        <span
                          className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md ${
                            inv.balanceDue <= 0
                              ? "bg-emerald-100 text-emerald-800"
                              : inv.depositPaid > 0
                              ? "bg-amber-100 text-amber-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {inv.balanceDue <= 0 ? "PAID" : inv.depositPaid > 0 ? "PARTIAL" : "UNPAID"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTargetId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm font-sans">
          <div className="bg-white max-w-sm w-full rounded-2xl p-6 shadow-2xl border border-slate-100 space-y-4 text-center relative">
            <button
              type="button"
              onClick={() => setDeleteTargetId(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              <FiX className="h-4 w-4" />
            </button>
            <div className="w-12 h-12 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto">
              <FiAlertTriangle className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900">Delete Record?</h3>
              <p className="text-xs text-slate-500 mt-1">This measurement entry will be permanently removed.</p>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteTargetId(null)}
                disabled={isDeleting}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                disabled={isDeleting}
                className="flex-1 py-2.5 rounded-xl bg-red-600 text-white font-bold text-xs shadow-md"
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Generate Invoice Slide-Over */}
      {openInvoiceModal && (
        <GenerateInvoice
          customer={selectedCustomer}
          tailorProfile={
            tailorProfile || {
              businessName: "StyleThread Bespoke Studio",
              tagline: "Master Tailoring & Fashion Architecture",
              phone: selectedCustomer.phone,
              whatsapp: "2348075608069",
              location: "Lagos, Nigeria",
            }
          }
          onInvoiceCreated={(newInv) => {
            // Real-time state update: Add new invoice to client ledger immediately
            setInvoicesList((prev) => [newInv, ...prev]);
            setActiveTab("invoices"); // Auto-switch tab to reveal newly created invoice
          }}
          setOpenInvoiceModal={setOpenInvoiceModal}
        />
      )}
    </>
  );
}