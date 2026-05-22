"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createField } from "../../../components/farmStore";

export default function AddFieldPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", acres: "", ownership: "Owned", rentCostPerAcre: "", currentCrop: "", legalLocation: "", notes: "", user: "Alex" });

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (!form.name.trim()) return;
    const field = await createField(form);
    router.push(`/farming/fields/${field.id}`);
  }

  return (
    <main className="app-shell">
      <header className="page-header">
        <Link href="/farming/fields" className="back-link">← Field list</Link>
        <h1>Add Field</h1>
        <p className="muted">Create a field record with acres, crop, ownership, rent cost, and notes.</p>
      </header>

      <form className="form-card" onSubmit={handleSubmit}>
        <label>Field name<input required value={form.name} onChange={(event) => updateField("name", event.target.value)} placeholder="Example: North 80" /></label>
        <label>Acres<input type="number" min="0" step="0.01" value={form.acres} onChange={(event) => updateField("acres", event.target.value)} placeholder="Example: 80" inputMode="decimal" /></label>
        <label>Ownership<select value={form.ownership} onChange={(event) => updateField("ownership", event.target.value)}><option>Owned</option><option>Rented</option><option>Custom</option><option>Other</option></select></label>
        {form.ownership === "Rented" && <label>Rent cost per acre<input type="number" min="0" step="0.01" value={form.rentCostPerAcre} onChange={(event) => updateField("rentCostPerAcre", event.target.value)} placeholder="Example: 75" inputMode="decimal" /></label>}
        <label>Current crop<input value={form.currentCrop} onChange={(event) => updateField("currentCrop", event.target.value)} placeholder="Wheat, barley, canola..." /></label>
        <label>Legal location / directions<input value={form.legalLocation} onChange={(event) => updateField("legalLocation", event.target.value)} placeholder="Quarter, road, or directions" /></label>
        <label>Notes<textarea value={form.notes} onChange={(event) => updateField("notes", event.target.value)} placeholder="Drainage, rocks, history, rental notes, etc." /></label>
        <label>Added by<select value={form.user} onChange={(event) => updateField("user", event.target.value)}><option>Alex</option><option>Riley</option><option>Sam</option><option>Maya</option></select></label>
        <button type="submit" className="button full">Save field</button>
      </form>
    </main>
  );
}
