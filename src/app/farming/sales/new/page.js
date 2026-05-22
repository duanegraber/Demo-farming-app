"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createCropSale, loadFields } from "../../../components/farmStore";

const units = ["bushels", "tonnes", "bales", "tons", "pounds"];
const cropYears = [2026, 2027, 2028, 2029, 2030];
const today = () => new Date().toISOString().slice(0, 10);

export default function AddCropSalePage() {
  const router = useRouter();
  const [fields, setFields] = useState([]);
  const [form, setForm] = useState({ fieldId: "", fieldName: "", crop: "", saleDate: today(), cropYear: new Date().getFullYear(), amount: "", unit: "bushels", pricePerUnit: "", deductions: "", buyer: "", notes: "", user: "Alex" });

  useEffect(() => {
    const id = window.requestAnimationFrame(() => loadFields().then(setFields).catch(console.error));
    return () => window.cancelAnimationFrame(id);
  }, []);

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function chooseField(fieldId) {
    const selected = fields.find((field) => field.id === fieldId);
    setForm((current) => ({ ...current, fieldId, fieldName: selected?.name || "", crop: selected?.currentCrop || current.crop }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (!form.fieldName.trim()) return;
    const sale = await createCropSale(form);
    router.push(`/farming/sales/${sale.id}`);
  }

  return (
    <main className="app-shell">
      <header className="page-header">
        <Link href="/farming/sales" className="back-link">← Crop sales</Link>
        <h1>Add Sale</h1>
        <p className="muted">Record sold crop amount, price, buyer, and deductions.</p>
      </header>
      <form className="form-card" onSubmit={handleSubmit}>
        <label>Field<select required value={form.fieldId} onChange={(event) => chooseField(event.target.value)}><option value="">Choose field</option>{fields.map((field) => <option value={field.id} key={field.id}>{field.name}</option>)}</select></label>
        <label>Crop<input value={form.crop} onChange={(event) => updateField("crop", event.target.value)} placeholder="Wheat, barley, canola..." /></label>
        <label>Sale date<input type="date" value={form.saleDate} onChange={(event) => updateField("saleDate", event.target.value)} /></label>
        <label>Crop year<select value={form.cropYear} onChange={(event) => updateField("cropYear", event.target.value)}>{cropYears.map((year) => <option key={year}>{year}</option>)}</select></label>
        <label>Amount sold<input type="number" min="0" step="0.01" value={form.amount} onChange={(event) => updateField("amount", event.target.value)} inputMode="decimal" /></label>
        <label>Unit<select value={form.unit} onChange={(event) => updateField("unit", event.target.value)}>{units.map((unit) => <option key={unit}>{unit}</option>)}</select></label>
        <label>Price per unit<input type="number" min="0" step="0.0001" value={form.pricePerUnit} onChange={(event) => updateField("pricePerUnit", event.target.value)} placeholder="Example: 8.25" inputMode="decimal" /></label>
        <label>Deductions / freight<input type="number" min="0" step="0.01" value={form.deductions} onChange={(event) => updateField("deductions", event.target.value)} placeholder="Optional" inputMode="decimal" /></label>
        <label>Buyer / elevator<input value={form.buyer} onChange={(event) => updateField("buyer", event.target.value)} placeholder="Buyer, elevator, feedlot..." /></label>
        <label>Notes<textarea value={form.notes} onChange={(event) => updateField("notes", event.target.value)} placeholder="Contract, grade, cheque notes, etc." /></label>
        <label>Added by<select value={form.user} onChange={(event) => updateField("user", event.target.value)}><option>Alex</option><option>Riley</option><option>Sam</option><option>Maya</option></select></label>
        <button type="submit" className="button full">Save sale</button>
      </form>
    </main>
  );
}
