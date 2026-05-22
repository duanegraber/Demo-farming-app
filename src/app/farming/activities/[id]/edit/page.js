"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { loadFieldActivities, loadFields, updateFieldActivity } from "../../../../components/farmStore";

const activityTypes = ["Seeding", "Fertilizer", "Spraying", "Tillage", "Irrigation", "Harvest", "Other note"];
const yieldUnits = ["bushels", "tonnes", "bales", "tons", "pounds"];
const cropYears = [2026, 2027, 2028, 2029, 2030];

export default function EditActivityPage() {
  const params = useParams();
  const router = useRouter();
  const [fields, setFields] = useState([]);
  const [form, setForm] = useState(null);

  useEffect(() => {
    const id = window.requestAnimationFrame(() => {
      Promise.all([loadFields(), loadFieldActivities()])
        .then(([fieldRows, activityRows]) => {
          setFields(fieldRows);
          const activity = activityRows.find((item) => item.id === params.id);
          if (activity) setForm({ ...activity, acres: activity.acres ?? "", cost: activity.cost ?? "", user: "Alex" });
        })
        .catch(console.error);
    });
    return () => window.cancelAnimationFrame(id);
  }, [params.id]);

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
    if (!form?.fieldName.trim()) return;
    await updateFieldActivity(params.id, form);
    router.push(`/farming/activities/${params.id}`);
  }

  if (!form) {
    return <main className="app-shell"><Link href="/farming/activities" className="back-link">← Activities</Link><h1>Loading...</h1></main>;
  }

  return (
    <main className="app-shell">
      <header className="page-header">
        <Link href={`/farming/activities/${params.id}`} className="back-link">← Activity</Link>
        <h1>Edit Activity</h1>
        <p className="muted">Fix field, date, product, rate, acres, cost, or notes.</p>
      </header>

      <form className="form-card" onSubmit={handleSubmit}>
        <label>Field<select required value={form.fieldId || ""} onChange={(event) => chooseField(event.target.value)}><option value="">Choose field</option>{fields.map((field) => <option value={field.id} key={field.id}>{field.name}</option>)}</select></label>
        <label>Activity type<select value={form.type} onChange={(event) => updateField("type", event.target.value)}>{activityTypes.map((type) => <option key={type}>{type}</option>)}</select></label>
        <label>Date<input type="date" value={form.activityDate} onChange={(event) => updateField("activityDate", event.target.value)} /></label>
        <label>Crop year<select value={form.cropYear} onChange={(event) => updateField("cropYear", event.target.value)}>{cropYears.map((year) => <option key={year}>{year}</option>)}</select></label>
        <label>Crop<input value={form.crop} onChange={(event) => updateField("crop", event.target.value)} /></label>
        <label>Product<input value={form.product} onChange={(event) => updateField("product", event.target.value)} /></label>
        <label>Rate<input value={form.rate} onChange={(event) => updateField("rate", event.target.value)} /></label>
        <label>Acres<input type="number" min="0" step="0.01" value={form.acres} onChange={(event) => updateField("acres", event.target.value)} inputMode="decimal" /></label>
        <label>Cost<input type="number" min="0" step="0.01" value={form.cost} onChange={(event) => updateField("cost", event.target.value)} inputMode="decimal" /></label>
        {form.type === "Harvest" && (
          <>
            <label>Yield amount<input type="number" min="0" step="0.01" value={form.yieldAmount} onChange={(event) => updateField("yieldAmount", event.target.value)} inputMode="decimal" /></label>
            <label>Yield unit<select value={form.yieldUnit} onChange={(event) => updateField("yieldUnit", event.target.value)}>{yieldUnits.map((unit) => <option key={unit}>{unit}</option>)}</select></label>
            <label>Moisture<input type="number" min="0" step="0.01" value={form.moisture} onChange={(event) => updateField("moisture", event.target.value)} inputMode="decimal" /></label>
            <label>Grade / quality<input value={form.grade} onChange={(event) => updateField("grade", event.target.value)} /></label>
            <label>Destination / bin<input value={form.destination} onChange={(event) => updateField("destination", event.target.value)} /></label>
          </>
        )}
        <label>Notes<textarea value={form.notes} onChange={(event) => updateField("notes", event.target.value)} /></label>
        <label>Updated by<select value={form.user} onChange={(event) => updateField("user", event.target.value)}><option>Alex</option><option>Riley</option><option>Sam</option><option>Maya</option></select></label>
        <button type="submit" className="button full">Save changes</button>
      </form>
    </main>
  );
}
