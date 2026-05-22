"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { createFieldActivity, loadFields } from "../../../components/farmStore";

const activityTypes = ["Seeding", "Fertilizer", "Spraying", "Tillage", "Irrigation", "Harvest", "Other note"];
const yieldUnits = ["bushels", "tonnes", "bales", "tons", "pounds"];
const cropYears = [2026, 2027, 2028, 2029, 2030];

function today() {
  return new Date().toISOString().slice(0, 10);
}

function AddActivityContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialFieldId = searchParams.get("fieldId") || "";
  const [fields, setFields] = useState([]);
  const [form, setForm] = useState({ fieldId: initialFieldId, fieldName: "", type: "Seeding", activityDate: today(), crop: "", product: "", rate: "", acres: "", cropYear: new Date().getFullYear(), cost: "", yieldAmount: "", yieldUnit: "bushels", moisture: "", grade: "", destination: "", notes: "", user: "Alex" });

  useEffect(() => {
    const id = window.requestAnimationFrame(() => {
      loadFields()
        .then((fieldRows) => {
          setFields(fieldRows);
          const selected = fieldRows.find((field) => field.id === initialFieldId);
          if (selected) {
            setForm((current) => ({ ...current, fieldId: selected.id, fieldName: selected.name, crop: selected.currentCrop, acres: selected.acres || "" }));
          }
        })
        .catch(console.error);
    });
    return () => window.cancelAnimationFrame(id);
  }, [initialFieldId]);

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function chooseField(fieldId) {
    const selected = fields.find((field) => field.id === fieldId);
    setForm((current) => ({
      ...current,
      fieldId,
      fieldName: selected?.name || "",
      crop: selected?.currentCrop || current.crop,
      acres: selected?.acres || current.acres,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (!form.fieldName.trim()) return;
    await createFieldActivity(form);
    router.push(form.fieldId ? `/farming/fields/${form.fieldId}` : "/farming/activities");
  }

  return (
    <main className="app-shell">
      <header className="page-header">
        <Link href="/farming/activities" className="back-link">← Activities</Link>
        <h1>Add Activity</h1>
        <p className="muted">Log a field pass, harvest note, or general crop note.</p>
      </header>

      <form className="form-card" onSubmit={handleSubmit}>
        <label>Field<select required value={form.fieldId} onChange={(event) => chooseField(event.target.value)}><option value="">Choose field</option>{fields.map((field) => <option value={field.id} key={field.id}>{field.name}</option>)}</select></label>
        <label>Activity type<select value={form.type} onChange={(event) => updateField("type", event.target.value)}>{activityTypes.map((type) => <option key={type}>{type}</option>)}</select></label>
        <label>Date<input type="date" value={form.activityDate} onChange={(event) => updateField("activityDate", event.target.value)} /></label>
        <label>Crop year<select value={form.cropYear} onChange={(event) => updateField("cropYear", event.target.value)}>{cropYears.map((year) => <option key={year}>{year}</option>)}</select></label>
        <label>Crop<input value={form.crop} onChange={(event) => updateField("crop", event.target.value)} placeholder="Wheat, barley, canola..." /></label>
        <label>Product<input value={form.product} onChange={(event) => updateField("product", event.target.value)} placeholder="Seed, fertilizer, chemical, etc." /></label>
        <label>Rate<input value={form.rate} onChange={(event) => updateField("rate", event.target.value)} placeholder="Example: 90 lb/ac, 0.5 L/ac" /></label>
        <label>Acres<input type="number" min="0" step="0.01" value={form.acres} onChange={(event) => updateField("acres", event.target.value)} inputMode="decimal" /></label>
        <label>Cost<input type="number" min="0" step="0.01" value={form.cost} onChange={(event) => updateField("cost", event.target.value)} placeholder="Total cost for this pass" inputMode="decimal" /></label>
        {form.type === "Harvest" && (
          <>
            <label>Yield amount<input type="number" min="0" step="0.01" value={form.yieldAmount} onChange={(event) => updateField("yieldAmount", event.target.value)} placeholder="Example: 5200" inputMode="decimal" /></label>
            <label>Yield unit<select value={form.yieldUnit} onChange={(event) => updateField("yieldUnit", event.target.value)}>{yieldUnits.map((unit) => <option key={unit}>{unit}</option>)}</select></label>
            <label>Moisture<input type="number" min="0" step="0.01" value={form.moisture} onChange={(event) => updateField("moisture", event.target.value)} placeholder="Example: 13.5" inputMode="decimal" /></label>
            <label>Grade / quality<input value={form.grade} onChange={(event) => updateField("grade", event.target.value)} placeholder="Example: #1, feed, tough, dry" /></label>
            <label>Destination / bin<input value={form.destination} onChange={(event) => updateField("destination", event.target.value)} placeholder="Bin, elevator, buyer, bale yard..." /></label>
          </>
        )}
        <label>Notes<textarea value={form.notes} onChange={(event) => updateField("notes", event.target.value)} placeholder="Weather, operator, field conditions, yield, destination, etc." /></label>
        <label>Added by<select value={form.user} onChange={(event) => updateField("user", event.target.value)}><option>Alex</option><option>Riley</option><option>Sam</option><option>Maya</option></select></label>
        <button type="submit" className="button full">Save activity</button>
      </form>
    </main>
  );
}

export default function AddActivityPage() {
  return (
    <Suspense fallback={<main className="app-shell"><p>Loading...</p></main>}>
      <AddActivityContent />
    </Suspense>
  );
}
