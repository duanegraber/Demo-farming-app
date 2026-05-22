"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { loadCropSales, loadFields, updateCropSale } from "../../../../components/farmStore";

const units = ["bushels", "tonnes", "bales", "tons", "pounds"];
const cropYears = [2026, 2027, 2028, 2029, 2030];

export default function EditCropSalePage() {
  const params = useParams();
  const router = useRouter();
  const [fields, setFields] = useState([]);
  const [form, setForm] = useState(null);

  useEffect(() => {
    const id = window.requestAnimationFrame(() => {
      Promise.all([loadFields(), loadCropSales()]).then(([fieldRows, sales]) => {
        setFields(fieldRows);
        const sale = sales.find((item) => item.id === params.id);
        if (sale) setForm({ ...sale, amount: sale.amount ?? "", pricePerUnit: sale.pricePerUnit ?? "", deductions: sale.deductions ?? "", user: "Alex" });
      }).catch(console.error);
    });
    return () => window.cancelAnimationFrame(id);
  }, [params.id]);

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function chooseField(fieldId) {
    const selected = fields.find((field) => field.id === fieldId);
    setForm((current) => ({ ...current, fieldId, fieldName: selected?.name || "", crop: selected?.currentCrop || current.crop }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (!form?.fieldName.trim()) return;
    await updateCropSale(params.id, form);
    router.push(`/farming/sales/${params.id}`);
  }

  if (!form) return <main className="app-shell"><Link href="/farming/sales" className="back-link">← Crop sales</Link><h1>Loading...</h1></main>;

  return (
    <main className="app-shell">
      <header className="page-header">
        <Link href={`/farming/sales/${params.id}`} className="back-link">← Sale</Link>
        <h1>Edit Sale</h1>
        <p className="muted">Fix amount, price, buyer, deductions, or notes.</p>
      </header>
      <form className="form-card" onSubmit={handleSubmit}>
        <label>Field<select required value={form.fieldId || ""} onChange={(event) => chooseField(event.target.value)}><option value="">Choose field</option>{fields.map((field) => <option value={field.id} key={field.id}>{field.name}</option>)}</select></label>
        <label>Crop<input value={form.crop} onChange={(event) => updateField("crop", event.target.value)} /></label>
        <label>Sale date<input type="date" value={form.saleDate} onChange={(event) => updateField("saleDate", event.target.value)} /></label>
        <label>Crop year<select value={form.cropYear} onChange={(event) => updateField("cropYear", event.target.value)}>{cropYears.map((year) => <option key={year}>{year}</option>)}</select></label>
        <label>Amount sold<input type="number" min="0" step="0.01" value={form.amount} onChange={(event) => updateField("amount", event.target.value)} inputMode="decimal" /></label>
        <label>Unit<select value={form.unit} onChange={(event) => updateField("unit", event.target.value)}>{units.map((unit) => <option key={unit}>{unit}</option>)}</select></label>
        <label>Price per unit<input type="number" min="0" step="0.0001" value={form.pricePerUnit} onChange={(event) => updateField("pricePerUnit", event.target.value)} inputMode="decimal" /></label>
        <label>Deductions / freight<input type="number" min="0" step="0.01" value={form.deductions} onChange={(event) => updateField("deductions", event.target.value)} inputMode="decimal" /></label>
        <label>Buyer / elevator<input value={form.buyer} onChange={(event) => updateField("buyer", event.target.value)} /></label>
        <label>Notes<textarea value={form.notes} onChange={(event) => updateField("notes", event.target.value)} /></label>
        <label>Updated by<select value={form.user} onChange={(event) => updateField("user", event.target.value)}><option>Alex</option><option>Riley</option><option>Sam</option><option>Maya</option></select></label>
        <button type="submit" className="button full">Save changes</button>
      </form>
    </main>
  );
}
