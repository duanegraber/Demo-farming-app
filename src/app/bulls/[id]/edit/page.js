"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { loadSires, loadLocations, updateBull } from "../../../components/farmStore";

export default function EditSirePage() {
  const params = useParams();
  const router = useRouter();
  const [locations, setLocations] = useState([]);
  const [form, setForm] = useState(null);

  useEffect(() => {
    const id = window.requestAnimationFrame(() => {
      loadPastures().then(setLocations).catch(console.error);
      loadSires()
        .then((sires) => {
          const sire = sires.find((item) => item.id === params.id);
          if (sire) setForm({ ...sire, purchaseCost: sire.purchaseCost ?? "", dateBought: sire.dateBought || "", sellingAmount: sire.sellingAmount ?? "", dateSold: sire.dateSold || "", user: "Alex" });
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
    if (!form?.tag.trim()) return;
    await updateBull(params.id, form);
    router.push(`/sires/${params.id}`);
  }

  if (!form) {
    return <main className="app-shell"><Link href="/sires" className="back-link">← Sire list</Link><h1>Loading...</h1></main>;
  }

  return (
    <main className="app-shell">
      <header className="page-header">
        <Link href={`/sires/${params.id}`} className="back-link">← Sire profile</Link>
        <h1>Edit Sire {form.tag}</h1>
        <p className="muted">Update sire status, location, purchase/sale info, and notes.</p>
      </header>
      <form className="form-card" onSubmit={handleSubmit}>
        <label>Sire tag number<input required value={form.tag} onChange={(event) => updateField("tag", event.target.value)} /></label>
        <label>Name<input value={form.name} onChange={(event) => updateField("name", event.target.value)} /></label>
        <label>Status<select value={form.status} onChange={(event) => updateField("status", event.target.value)}><option>Active</option><option>Watch</option><option>Sold</option><option>Dead</option><option>Culled</option></select></label>
        <label>Breed<input value={form.breed} onChange={(event) => updateField("breed", event.target.value)} /></label>
        <label>Location<select value={form.location} onChange={(event) => updateField("location", event.target.value)}><option value="">Choose location</option>{locations.map((location) => <option key={location}>{location}</option>)}</select></label>
        <label>Purchase cost<input type="number" min="0" step="0.01" value={form.purchaseCost} onChange={(event) => updateField("purchaseCost", event.target.value)} inputMode="decimal" /></label>
        <label>Date bought<input value={form.dateBought} onChange={(event) => updateField("dateBought", event.target.value)} placeholder="May 10, 2026" /></label>
        <label>Selling amount<input type="number" min="0" step="0.01" value={form.sellingAmount} onChange={(event) => updateField("sellingAmount", event.target.value)} inputMode="decimal" /></label>
        <label>Date sold<input value={form.dateSold} onChange={(event) => updateField("dateSold", event.target.value)} placeholder="May 10, 2026" /></label>
        <label>Notes<textarea value={form.notes} onChange={(event) => updateField("notes", event.target.value)} /></label>
        <label>Updated by<select value={form.user} onChange={(event) => updateField("user", event.target.value)}><option>Alex</option><option>Riley</option><option>Sam</option><option>Maya</option></select></label>
        <button type="submit" className="button full">Save changes</button>
      </form>
    </main>
  );
}
