"use client";

import React, { useState, useEffect } from "react";
import { pdf } from "@react-pdf/renderer";
import InvoicePDF from "./InvoicePDF";
import { FiX, FiDownload, FiCheckCircle, FiPlus, FiTrash2 } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa6";

const OUTFIT_CATEGORIES = [
  "Senator",
  "Agbada",
  "Suit",
  "Shirt",
  "Trouser",
  "Gown",
  "Street Wear",
  "General Tailoring",
];

export default function GenerateInvoice({
  customer,
  tailorProfile: initialTailorProfile,
  outfitDetails,
  onInvoiceCreated,
  setOpenInvoiceModal,
}) {
  const [tailor, setTailor] = useState(initialTailorProfile || null);
  const [docType, setDocType] = useState("INVOICE");

  // Multi-Category Line Items State
  const [items, setItems] = useState([
    {
      title: outfitDetails?.title || "Bespoke Outfit Design & Stitching",
      category: outfitDetails?.category?.name || "Senator",
      quantity: 1,
      unitPrice: outfitDetails?.price || 45000,
    },
  ]);

  const [depositPaid, setDepositPaid] = useState(25000);
  const [generating, setGenerating] = useState(false);
  const [savingRecord, setSavingRecord] = useState(false);

  // Fetch Tailor details dynamically from backend profile API if not passed in
  useEffect(() => {
    if (!tailor) {
      async function fetchTailorProfile() {
        try {
          const res = await fetch("/api/dashboard", { cache: "no-store" });
          if (res.ok) {
            const data = await res.json();
            setTailor(data.tailor);
          }
        } catch (err) {
          console.error("Failed to load tailor profile details", err);
        }
      }
      fetchTailorProfile();
    }
  }, [tailor]);

  // Dynamic Add Line Item
  const handleAddItem = () => {
    setItems((prev) => [
      ...prev,
      {
        title: "Additional Garment / Service",
        category: "Senator",
        quantity: 1,
        unitPrice: 15000,
      },
    ]);
  };

  // Dynamic Remove Line Item
  const handleRemoveItem = (index) => {
    if (items.length <= 1) return;
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  // Update specific item field
  const handleItemChange = (index, field, value) => {
    setItems((prev) =>
      prev.map((item, i) => {
        if (i === index) {
          return { ...item, [field]: value };
        }
        return item;
      })
    );
  };

  // Calculations across all line items
  const totalCost = items.reduce(
    (sum, item) => sum + Number(item.unitPrice || 0) * Number(item.quantity || 1),
    0
  );
  const balanceDue = totalCost - Number(depositPaid);

  const invoiceNumber = `INV-${Math.floor(100000 + Math.random() * 900000)}`;
  const currentDate = new Date().toLocaleDateString();

  const invoiceData = {
    tailor: tailor || {
      businessName: "StyleThread Tailor",
      tagline: "Bespoke Apparel & Design",
      phone: customer?.phone || "",
      whatsapp: customer?.phone || "",
      location: "Lagos, Nigeria",
    },
    customer,
    invoiceNumber,
    date: currentDate,
    items,
    subtotal: totalCost,
    depositPaid: Number(depositPaid),
    type: docType,
  };

  // Persist invoice entry to backend DB
  const saveInvoiceToDatabase = async () => {
    try {
      setSavingRecord(true);

      // Concatenate item descriptions for backend record
      const mainItemTitle = items.map((it) => `${it.quantity}x ${it.title}`).join(", ");
      const mainCategory = items.map((it) => it.category).join(", ");
      const totalQuantity = items.reduce((acc, it) => acc + Number(it.quantity || 1), 0);

      const res = await fetch("/api/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerId: customer.id,
          docType,
          itemTitle: mainItemTitle,
          category: mainCategory,
          quantity: totalQuantity,
          unitPrice: totalCost,
          totalAmount: totalCost,
          depositPaid: Number(depositPaid),
          balanceDue,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (onInvoiceCreated) onInvoiceCreated(data.invoice);
      }
    } catch (err) {
      console.error("Failed to save invoice record:", err);
    } finally {
      setSavingRecord(false);
    }
  };

  const createPdfFile = async () => {
    const blob = await pdf(<InvoicePDF invoiceData={invoiceData} />).toBlob();
    const fileName = `${docType}_${customer.fullName.replace(/\s+/g, "_")}_${invoiceNumber}.pdf`;
    return {
      blob,
      fileName,
      file: new File([blob], fileName, { type: "application/pdf" }),
    };
  };

  const handleSharePdfToWhatsApp = async () => {
    setGenerating(true);
    await saveInvoiceToDatabase();

    try {
      const { file, blob, fileName } = await createPdfFile();

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: `${docType} for ${customer.fullName}`,
          text: `Hello ${customer.fullName}, here is your official ${docType.toLowerCase()} from ${
            tailor?.businessName || "StyleThread"
          }.`,
        });
      } else {
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = fileName;
        link.click();
        URL.revokeObjectURL(url);

        let cleanPhone = customer.phone?.replace(/\D/g, "") || "";
        if (cleanPhone.startsWith("0")) cleanPhone = `234${cleanPhone.slice(1)}`;

        const summaryItems = items.map((it) => `${it.quantity}x ${it.title} (${it.category})`).join("\n• ");

        const message = `Hello *${customer.fullName}*! 👋\n\nYour *${docType}* (#${invoiceNumber}) from *${
          tailor?.businessName || "StyleThread"
        }* is ready.\n\n*Items Included:*\n• ${summaryItems}\n\n*Total Cost:* ₦${totalCost.toLocaleString()}\n*Amount Paid:* ₦${Number(
          depositPaid
        ).toLocaleString()}\n*Balance Due:* ${
          balanceDue <= 0 ? "PAID IN FULL ✅" : `₦${balanceDue.toLocaleString()} ⏳`
        }`;

        window.open(
          `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`,
          "_blank"
        );
      }
    } catch (err) {
      if (err.name !== "AbortError") {
        console.error("Error sharing PDF:", err);
      }
    } finally {
      setGenerating(false);
    }
  };

  const handleDownloadPDF = async () => {
    setGenerating(true);
    await saveInvoiceToDatabase();

    try {
      const { blob, fileName } = await createPdfFile();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      link.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("PDF download failed:", err);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm overflow-hidden font-sans">
      <div className="relative w-full max-w-lg bg-white h-full shadow-2xl flex flex-col justify-between z-10">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/80">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-100 text-[#128C7E] rounded-xl">
              <FiCheckCircle className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-extrabold text-slate-800 text-base">
                Create Multi-Category Invoice
              </h2>
              <p className="text-[11px] text-slate-500">
                Client: {customer?.fullName} {tailor?.businessName && `| ${tailor.businessName}`}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setOpenInvoiceModal(false)}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-200/60 transition-colors"
          >
            <FiX className="h-5 w-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Document Type Selector */}
          <div>
            <label className="block text-xs font-bold uppercase text-slate-700 tracking-wide mb-1.5">
              Document Type
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setDocType("INVOICE")}
                className={`py-2 rounded-xl text-xs font-bold transition-all ${
                  docType === "INVOICE"
                    ? "bg-[#128C7E] text-white shadow-md"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                Invoice (Deposit/Balance)
              </button>
              <button
                type="button"
                onClick={() => setDocType("RECEIPT")}
                className={`py-2 rounded-xl text-xs font-bold transition-all ${
                  docType === "RECEIPT"
                    ? "bg-[#128C7E] text-white shadow-md"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                Payment Receipt
              </button>
            </div>
          </div>

          {/* Dynamic Line Items Section */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="block text-xs font-extrabold uppercase text-slate-700 tracking-wide">
                Outfit Items / Services ({items.length})
              </label>
              <button
                type="button"
                onClick={handleAddItem}
                className="inline-flex items-center gap-1 text-[11px] font-bold text-[#128C7E] hover:underline"
              >
                <FiPlus /> Add Item
              </button>
            </div>

            {items.map((item, index) => (
              <div
                key={index}
                className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 relative"
              >
                {items.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(index)}
                    className="absolute top-3 right-3 text-slate-400 hover:text-red-500 p-1 transition-colors"
                    title="Remove Item"
                  >
                    <FiTrash2 size={14} />
                  </button>
                )}

                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-2">
                    <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">
                      Category
                    </label>
                    <select
                      value={item.category}
                      onChange={(e) => handleItemChange(index, "category", e.target.value)}
                      className="w-full rounded-xl border border-slate-300 px-3 py-1.5 text-xs text-black outline-none focus:border-[#128C7E] bg-white font-medium"
                    >
                      {OUTFIT_CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">
                      Quantity
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) =>
                        handleItemChange(index, "quantity", Math.max(1, Number(e.target.value)))
                      }
                      className="w-full rounded-xl border border-slate-300 px-3 py-1.5 text-xs text-black outline-none focus:border-[#128C7E]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-2">
                    <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">
                      Description / Title
                    </label>
                    <input
                      type="text"
                      value={item.title}
                      onChange={(e) => handleItemChange(index, "title", e.target.value)}
                      className="w-full rounded-xl border border-slate-300 px-3 py-1.5 text-xs text-black outline-none focus:border-[#128C7E]"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">
                      Unit Price (₦)
                    </label>
                    <input
                      type="number"
                      value={item.unitPrice}
                      onChange={(e) => handleItemChange(index, "unitPrice", e.target.value)}
                      className="w-full rounded-xl border border-slate-300 px-3 py-1.5 text-xs text-black outline-none focus:border-[#128C7E]"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Deposit Paid Input */}
          <div>
            <label className="block text-xs font-bold uppercase text-slate-700 tracking-wide mb-1">
              Deposit Paid (₦)
            </label>
            <input
              type="number"
              value={depositPaid}
              onChange={(e) => setDepositPaid(e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-xs text-black outline-none focus:border-[#128C7E]"
            />
          </div>

          {/* Real-time Calculation Summary Card */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5 font-sans">
            <div className="flex justify-between text-xs font-semibold text-slate-600">
              <span>Subtotal ({items.length} item types):</span>
              <span>₦{totalCost.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-xs font-bold text-[#128C7E]">
              <span>Deposit Paid:</span>
              <span>₦{Number(depositPaid).toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-xs font-black text-slate-900 pt-1.5 border-t border-slate-200">
              <span>Balance Remaining:</span>
              <span className={balanceDue <= 0 ? "text-emerald-600" : "text-red-600"}>
                {balanceDue <= 0 ? "PAID IN FULL" : `₦${balanceDue.toLocaleString()}`}
              </span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-5 border-t border-slate-100 bg-white space-y-2">
          <button
            type="button"
            onClick={handleSharePdfToWhatsApp}
            disabled={generating || savingRecord}
            className="w-full py-3.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs shadow-md flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50 cursor-pointer"
          >
            <FaWhatsapp size={18} />
            {generating ? "Saving & Preparing PDF..." : "Save & Share PDF to WhatsApp"}
          </button>

          <button
            type="button"
            onClick={handleDownloadPDF}
            disabled={generating || savingRecord}
            className="w-full py-3 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-50 flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <FiDownload size={16} /> Download Official PDF
          </button>
        </div>

      </div>
    </div>
  );
}