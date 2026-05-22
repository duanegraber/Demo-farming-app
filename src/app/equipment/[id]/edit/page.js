"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { loadEquipment, updateEquipment } from "../../../components/farmStore";

const types = ["Tractor", "Combine", "Truck", "Sprayer", "Baler", "Trailer", "Tillage", "Seeding", "Other"];
const statuses = ["Active", "Seasonal", "Needs repair", "Sold", "Retired"];
const meterUnits = ["hours", "km", "miles"];

export default function EditEquipmentPage() {
  const params = useParams();
  const router = useRouter();
  const [form, setForm] = useState(null);

  useEffect(() => {
    const id = window.requestAnimationFrame(() => {
      loadEquipment()
        .then((items) => {
          const item = items.find((entry) => entry.id === params.id);
          if (item) setForm({ ...item, currentMeter: item.currentMeter ?? "", user: "Alex" });
        })
        .catch(console.error);
    });
    return () => window.cancelAnimationFrame(id);
  }, [params.id]);

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (!form?.name.trim()) return;
    await updateEquipment(params.id, form);
    router.push(`/equipment/${params.id}`);
  }

  if (!form) {
    return <main className="app-shell"><Link href="/equipment" className="back-link">← Equipment</Link><h1>Loading...</h1></main>;
  }

  return (
    <main className="app-shell">
      <header className="page-header">
        <Link href={`/equipment/${params.id}`} className="back-link">← Equipment profile</Link>
        <h1>Edit {form.name}</h1>
        <p className="muted">Update status, meter reading, identifiers, and notes.</p>
      </header>

      <form className="form-card" onSubmit={handleSubmit}>
        <label>Equipment name<input required value={form.name} onChange={(event) => updateField("name", event.target.value)} /></label>
        <label>Type<select value={form.type} onChange={(event) => updateField("type", event.target.value)}>{types.map((type) => <option key={type}>{type}</option>)}</select></label>
        <label>Status<select value={form.status} onChange={(event) => updateField("status", event.target.value)}>{statuses.map((status) => <option key={status}>{status}</option>)}</select></label>
        <label>Serial / VIN / unit number<input value={form.identifier} onChange={(event) => updateField("identifier", event.target.value)} /></label>
        <label>Current meter<input type="number" min="0" step="0.1" value={form.currentMeter} onChange={(event) => updateField("currentMeter", event.target.value)} inputMode="decimal" /></label>
        <label>Meter unit<select value={form.meterUnit} onChange={(event) => updateField("meterUnit", event.target.value)}>{meterUnits.map((unit) => <option key={unit}>{unit}</option>)}</select></label>
        <label>Notes<textarea value={form.notes} onChange={(event) => updateField("notes", event.target.value)} /></label>
        <label>Updated by<select value={form.user} onChange={(event) => updateField("user", event.target.value)}><option>Alex</option><option>Riley</option><option>Sam</option><option>Maya</option></select></label>
        <button type="submit" className="button full">Save changes</button>
      </form>
    </main>
  );
}
