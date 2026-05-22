"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createCow, loadLocations } from "../../components/farmStore";

export default function AddCowPage() {
  const router = useRouter();
  const [locations, setLocations] = useState([]);
  const [form, setForm] = useState({ tag: "", status: "Active", color: "", location: "", lastCalved: "", offspringTag: "", purchaseCost: "", dateBought: "", sellingAmount: "", dateSold: "", notes: "", user: "Alex" });

  useEffect(() => {
    const id = window.requestAnimationFrame(() => {
      loadLocations().then(setLocations).catch(console.error);
    });
    return () => window.cancelAnimationFrame(id);
  }, []);

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (!form.tag.trim()) return;
    const cow = await createCow(form);
    router.push(`/livestock/${cow.id}`);
  }

  return (
    <main className="app-shell">
      <header className="page-header">
        <Link href="/" className="back-link">← Home</Link>
        <h1>Add Animal</h1>
        <p className="muted">Add a new animal by tag number. Saves on this device for now.</p>
      </header>
      <form className="form-card" onSubmit={handleSubmit}>
        <label>Animal tag number<input required value={form.tag} onChange={(event) => updateField("tag", event.target.value)} placeholder="Example: 83" inputMode="numeric" /></label>
        <label>Status<select value={form.status} onChange={(event) => updateField("status", event.target.value)}><option>Active</option><option>Watch</option><option>Sold</option><option>Dead</option><option>Culled</option></select></label>
        <label>Color / description<input value={form.color} onChange={(event) => updateField("color", event.target.value)} placeholder="Black, red, brockle face..." /></label>
        <label>Location<select value={form.location} onChange={(event) => updateField("location", event.target.value)}><option value="">Choose location</option>{locations.map((location) => <option key={location}>{location}</option>)}</select></label>
        <label>Last offspring
          <input type="date" value={form.lastCalved} onChange={(event) => updateField("lastCalved", event.target.value)} />
          <span className="field-note">{form.lastCalved ? "Date selected" : "No date selected — tap the box above to choose one"}</span>
        </label>
        <label>Current offspring tag<input value={form.offspringTag} onChange={(event) => updateField("offspringTag", event.target.value)} placeholder="Optional" inputMode="numeric" /></label>
        <label>Purchase cost<input type="number" min="0" step="0.01" value={form.purchaseCost} onChange={(event) => updateField("purchaseCost", event.target.value)} placeholder="Example: 2500" inputMode="decimal" /></label>
        <label>Date bought
          <input type="date" value={form.dateBought} onChange={(event) => updateField("dateBought", event.target.value)} />
          <span className="field-note">Optional — leave blank if raised on farm</span>
        </label>
        <label>Selling amount<input type="number" min="0" step="0.01" value={form.sellingAmount} onChange={(event) => updateField("sellingAmount", event.target.value)} placeholder="Optional" inputMode="decimal" /></label>
        <label>Date sold
          <input type="date" value={form.dateSold} onChange={(event) => updateField("dateSold", event.target.value)} />
          <span className="field-note">Optional — fill in when sold</span>
        </label>
        <label>Notes<textarea value={form.notes} onChange={(event) => updateField("notes", event.target.value)} placeholder="Anything useful to remember" /></label>
        <label>Added by<select value={form.user} onChange={(event) => updateField("user", event.target.value)}><option>Alex</option><option>Riley</option><option>Sam</option><option>Maya</option></select></label>
        <button type="submit" className="button full">Save animal</button>
      </form>
    </main>
  );
}
