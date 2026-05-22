"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createEquipment } from "../../components/farmStore";

const types = ["Tractor", "Combine", "Truck", "Sprayer", "Baler", "Trailer", "Tillage", "Seeding", "Other"];
const statuses = ["Active", "Seasonal", "Needs repair", "Sold", "Retired"];
const meterUnits = ["hours", "km", "miles"];

export default function AddEquipmentPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", type: "Tractor", status: "Active", identifier: "", currentMeter: "", meterUnit: "hours", notes: "", user: "Alex" });

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (!form.name.trim()) return;
    const item = await createEquipment(form);
    router.push(`/equipment/${item.id}`);
  }

  return (
    <main className="app-shell">
      <header className="page-header">
        <Link href="/equipment" className="back-link">← Equipment</Link>
        <h1>Add Equipment</h1>
        <p className="muted">Create one record per machine or major implement.</p>
      </header>

      <form className="form-card" onSubmit={handleSubmit}>
        <label>Equipment name<input required value={form.name} onChange={(event) => updateField("name", event.target.value)} placeholder="Example: Sam Deere 4440" /></label>
        <label>Type<select value={form.type} onChange={(event) => updateField("type", event.target.value)}>{types.map((type) => <option key={type}>{type}</option>)}</select></label>
        <label>Status<select value={form.status} onChange={(event) => updateField("status", event.target.value)}>{statuses.map((status) => <option key={status}>{status}</option>)}</select></label>
        <label>Serial / VIN / unit number<input value={form.identifier} onChange={(event) => updateField("identifier", event.target.value)} placeholder="Optional" /></label>
        <label>Current meter<input type="number" min="0" step="0.1" value={form.currentMeter} onChange={(event) => updateField("currentMeter", event.target.value)} inputMode="decimal" /></label>
        <label>Meter unit<select value={form.meterUnit} onChange={(event) => updateField("meterUnit", event.target.value)}>{meterUnits.map((unit) => <option key={unit}>{unit}</option>)}</select></label>
        <label>Notes<textarea value={form.notes} onChange={(event) => updateField("notes", event.target.value)} placeholder="Ownership, common issues, tire size, filter notes, etc." /></label>
        <label>Added by<select value={form.user} onChange={(event) => updateField("user", event.target.value)}><option>Alex</option><option>Riley</option><option>Sam</option><option>Maya</option></select></label>
        <button type="submit" className="button full">Save equipment</button>
      </form>
    </main>
  );
}
