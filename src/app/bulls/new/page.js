"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createBull, loadPastures } from "../../components/farmStore";

export default function AddSirePage() {
  const router = useRouter();
  const [locations, setLocations] = useState([]);
  const [form, setForm] = useState({ tag: "", name: "", status: "Active", breed: "", location: "", purchaseCost: "", dateBought: "", sellingAmount: "", dateSold: "", notes: "", user: "Alex" });

  useEffect(() => {
    const id = window.requestAnimationFrame(() => {
      loadPastures().then(setLocations).catch(console.error);
    });
    return () => window.cancelAnimationFrame(id);
  }, []);

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (!form.tag.trim()) return;
    const sire = await createBull(form);
    router.push(`/sires/${sire.id}`);
  }

  return (
    <main className="app-shell">
      <header className="page-header">
        <Link href="/sires" className="back-link">← Sire list</Link>
        <h1>Add Sire</h1>
        <p className="muted">Add a sire by tag number or name.</p>
      </header>
      <form className="form-card" onSubmit={handleSubmit}>
        <label>Sire tag number<input required value={form.tag} onChange={(event) => updateField("tag", event.target.value)} placeholder="Example: B12" /></label>
        <label>Name<input value={form.name} onChange={(event) => updateField("name", event.target.value)} placeholder="Optional" /></label>
        <label>Status<select value={form.status} onChange={(event) => updateField("status", event.target.value)}><option>Active</option><option>Watch</option><option>Sold</option><option>Dead</option><option>Culled</option></select></label>
        <label>Breed<input value={form.breed} onChange={(event) => updateField("breed", event.target.value)} placeholder="Red Angus, Black Angus..." /></label>
        <label>Location<select value={form.location} onChange={(event) => updateField("location", event.target.value)}><option value="">Choose location</option>{locations.map((location) => <option key={location}>{location}</option>)}</select></label>
        <label>Purchase cost<input type="number" min="0" step="0.01" value={form.purchaseCost} onChange={(event) => updateField("purchaseCost", event.target.value)} placeholder="Example: 6500" inputMode="decimal" /></label>
        <label>Date bought<input type="date" value={form.dateBought} onChange={(event) => updateField("dateBought", event.target.value)} /></label>
        <label>Selling amount<input type="number" min="0" step="0.01" value={form.sellingAmount} onChange={(event) => updateField("sellingAmount", event.target.value)} placeholder="Optional" inputMode="decimal" /></label>
        <label>Date sold<input type="date" value={form.dateSold} onChange={(event) => updateField("dateSold", event.target.value)} /></label>
        <label>Notes<textarea value={form.notes} onChange={(event) => updateField("notes", event.target.value)} placeholder="Breeding notes, temperament, injuries, etc." /></label>
        <label>Added by<select value={form.user} onChange={(event) => updateField("user", event.target.value)}><option>Alex</option><option>Riley</option><option>Sam</option><option>Maya</option></select></label>
        <button type="submit" className="button full">Save sire</button>
      </form>
    </main>
  );
}
