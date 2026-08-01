import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: "Helvetica",
    fontSize: 10,
    color: "#333333",
    position: "relative",
  },
  watermark: {
    position: "absolute",
    top: "32%",
    left: "22%",
    width: 320,
    height: 320,
    opacity: 0.07,
    zIndex: -1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: "#128C7E",
    paddingBottom: 12,
    marginBottom: 20,
  },
  brandContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  logoHeader: {
    width: 45,
    height: 45,
    borderRadius: 6,
    objectFit: "cover",
  },
  brandName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#128C7E",
  },
  tagline: {
    fontSize: 8,
    color: "#666666",
    marginTop: 2,
  },
  invoiceTitle: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "right",
    color: "#111827",
  },
  invoiceMeta: {
    fontSize: 9,
    color: "#666666",
    textAlign: "right",
    marginTop: 2,
  },
  section: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  box: {
    width: "48%",
    backgroundColor: "#F9FAFB",
    padding: 10,
    borderRadius: 6,
  },
  boxTitle: {
    fontSize: 8,
    fontWeight: "bold",
    color: "#9CA3AF",
    textTransform: "uppercase",
    marginBottom: 4,
  },
  boldText: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#111827",
  },
  table: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 6,
    marginBottom: 20,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#F3F4F6",
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    fontWeight: "bold",
  },
  tableRow: {
    flexDirection: "row",
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  colDesc: { width: "40%" },
  colCategory: { width: "20%", textAlign: "center" },
  colQty: { width: "15%", textAlign: "center" },
  colPrice: { width: "25%", textAlign: "right" },

  totalsContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: 20,
  },
  totalsBox: {
    width: "48%",
    padding: 10,
    backgroundColor: "#F9FAFB",
    borderRadius: 6,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  grandTotalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    paddingTop: 6,
    marginTop: 4,
  },
  footer: {
    position: "absolute",
    bottom: 25,
    left: 30,
    right: 30,
    textAlign: "center",
    fontSize: 8,
    color: "#9CA3AF",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    paddingTop: 10,
  },
});

export default function InvoicePDF({ invoiceData }) {
  const {
    tailor,
    customer,
    invoiceNumber,
    date,
    items = [],
    subtotal = 0,
    depositPaid = 0,
    type = "INVOICE",
  } = invoiceData;

  const balanceDue = subtotal - depositPaid;
  const logoSrc = tailor?.logoUrl || null;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Background Logo Watermark Mask */}
        {logoSrc && <Image src={logoSrc} style={styles.watermark} />}

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.brandContainer}>
            {logoSrc && <Image src={logoSrc} style={styles.logoHeader} />}
            <View>
              <Text style={styles.brandName}>
                {tailor?.businessName || "StyleThread Bespoke"}
              </Text>
              <Text style={styles.tagline}>
                {tailor?.tagline || "Bespoke Apparel & Design"}
              </Text>
              {tailor?.phone && <Text style={styles.tagline}>Tel: {tailor.phone}</Text>}
            </View>
          </View>

          <View>
            <Text style={styles.invoiceTitle}>
              {type === "RECEIPT" ? "PAYMENT RECEIPT" : "INVOICE"}
            </Text>
            <Text style={styles.invoiceMeta}>#{invoiceNumber}</Text>
            <Text style={styles.invoiceMeta}>Date: {date}</Text>
          </View>
        </View>

        {/* Client & Workshop Info */}
        <View style={styles.section}>
          <View style={styles.box}>
            <Text style={styles.boxTitle}>Billed To (Client)</Text>
            <Text style={styles.boldText}>{customer?.fullName || "Valued Client"}</Text>
            <Text>Phone: {customer?.phone || "--"}</Text>
            {customer?.email && <Text>Email: {customer.email}</Text>}
          </View>

          <View style={styles.box}>
            <Text style={styles.boxTitle}>Workshop Details</Text>
            <Text style={styles.boldText}>{tailor?.businessName || "Workshop"}</Text>
            <Text>Location: {tailor?.location || "N/A"}</Text>
            <Text>WhatsApp: +{tailor?.whatsapp || tailor?.phone || "--"}</Text>
          </View>
        </View>

        {/* Line Items Table */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.colDesc}>Outfit / Service Description</Text>
            <Text style={styles.colCategory}>Category</Text>
            <Text style={styles.colQty}>Qty</Text>
            <Text style={styles.colPrice}>Amount (₦)</Text>
          </View>
          {items.map((item, index) => {
            const lineTotal = Number(item.price || 0) * Number(item.quantity || 1);
            return (
              <View style={styles.tableRow} key={index}>
                <Text style={styles.colDesc}>{item.title}</Text>
                <Text style={styles.colCategory}>{item.category || "Bespoke"}</Text>
                <Text style={styles.colQty}>{item.quantity || 1}</Text>
                <Text style={styles.colPrice}>₦{lineTotal.toLocaleString()}</Text>
              </View>
            );
          })}
        </View>

        {/* Totals Breakdown */}
        <View style={styles.totalsContainer}>
          <View style={styles.totalsBox}>
            <View style={styles.totalRow}>
              <Text>Total Cost:</Text>
              <Text style={{ fontWeight: "bold" }}>₦{subtotal.toLocaleString()}</Text>
            </View>
            <View style={styles.totalRow}>
              <Text>Deposit Paid:</Text>
              <Text style={{ color: "#128C7E", fontWeight: "bold" }}>
                ₦{depositPaid.toLocaleString()}
              </Text>
            </View>
            <View style={styles.grandTotalRow}>
              <Text style={{ fontWeight: "bold", fontSize: 11 }}>
                {balanceDue <= 0 ? "Status:" : "Balance Due:"}
              </Text>
              <Text
                style={{
                  fontWeight: "bold",
                  fontSize: 11,
                  color: balanceDue <= 0 ? "#128C7E" : "#DC2626",
                }}
              >
                {balanceDue <= 0 ? "PAID IN FULL" : `₦${balanceDue.toLocaleString()}`}
              </Text>
            </View>
          </View>
        </View>

        {/* Footer */}
        <Text style={styles.footer}>
          Thank you for choosing {tailor?.businessName || "us"}! Please present this document during fitting/pickup.
        </Text>
      </Page>
    </Document>
  );
}