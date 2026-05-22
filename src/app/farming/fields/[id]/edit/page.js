"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { loadFields, updateField } from "../../../../components/farmStore";

export default function EditFieldPage() {
  const params = useParams();
  const router = useRouter();
  const [form, setForm] = useState(null);

  useEffect(() => {
    const id = window.requestAnimationFrame(() => {
      loadFields()
        .then((fields) => {
          const field = fields.find((item) => item.id === params.id);
          if (field) setForm({ ...field, acres: field.acres ?? "", rentCostPerAcre: field.rentCostPerAcre ?? "", user: "Alex" });
        })
        .catch(console.error);
    });
    return () => window.cancelAnimationFrame(id);
  }, [params.id]);

  function updateFormField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (!form?.name.trim()) return;
    await updateField(params.id, form);
    router.push(`/farming/fields/${params.id}`);
  }

  if (!form) {
    return <main className="app-shell"><Link href="/farming/fields" className="back-link">← Field list</Link><h1>Loading...</h1></main>;
  }

  return (
    <main className="app-shell">
      <header className="page-header">
        <Link href={`/farming/fields/${params.id}`} className="back-link">← Field profile</Link>
        <h1>Edit {form.name}</h1>
        <p className="muted">Update acres, rent cost, current crop, ownership, location, and notes.</p>
      </header>

      <form className="form-card" onSubmit={handleSubmit}>
        <label>Field name<input required value={form.name} onChange={(event) => updateFormField("name", event.target.value)} /></label>
        <label>Acres<input type="number" min="0" step="0.01" value={form.acres} onChange={(event) => updateFormField("acres", event.target.value)} inputMode="decimal" /></label>
        <label>Ownership<select value={form.ownership} onChange={(event) => updateFormField("ownership", event.target.value)}><option>Owned</option><option>Rented</option><option>Custom</option><option>Other</option></select></label>
        {form.ownership === "Rented" && <label>Rent cost per acre<input type="number" min="0" step="0.01" value={form.rentCostPerAcre} onChange={(event) => updateFormField("rentCostPerAcre", event.target.value)} inputMode="decimal" /></label>}
        <label>Current crop<input value={form.currentCrop} onChange={(event) => updateFormField("currentCrop", event.target.value)} /></label>
        <label>Legal location / directions<input value={form.legalLocation} onChange={(event) => updateFormField("legalLocation", event.target.value)} /></label>
        <label>Notes<textarea value={form.notes} onChange={(event) => updateFormField("notes", event.target.value)} /></label>
        <label>Updated by<select value={form.user} onChange={(event) => updateFormField("user", event.target.value)}><option>Alex</option><option>Riley</option><option>Sam</option><option>Maya</option></select></label>
        <button type="submit" className="button full">Save changes</button>
      </form>
    </main>
  );
}
