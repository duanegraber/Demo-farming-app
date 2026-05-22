"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { createPasture, loadBulls, loadCows, loadPastures } from "../components/farmStore";

export default function PasturesPage() {
  const [cows, setCows] = useState([]);
  const [bulls, setBulls] = useState([]);
  const [pastures, setPastures] = useState([]);
  const [form, setForm] = useState({ name: "", notes: "", user: "Alex" });
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  function refreshData() {
    loadPastures().then(setPastures).catch(console.error);
    loadCows().then(setCows).catch(console.error);
    loadBulls().then(setBulls).catch(console.error);
  }

  useEffect(() => {
    const id = window.requestAnimationFrame(refreshData);
    return () => window.cancelAnimationFrame(id);
  }, []);

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (!form.name.trim()) return;
    setSaving(true);
    setMessage("");
    try {
      const pasture = await createPasture(form);
      setForm({ name: "", notes: "", user: form.user });
      setMessage(`${pasture} added.`);
      refreshData();
    } catch (error) {
      setMessage(error.message || "Could not add pasture.");
    } finally {
      setSaving(false);
    }
  }

  const animalsByPasture = useMemo(() => {
    return pastures.map((pasture) => ({
      pasture,
      cows: cows.filter((cow) => cow.location === pasture),
      bulls: bulls.filter((bull) => bull.location === pasture),
    }));
  }, [bulls, cows, pastures]);

  return (
    <main className="app-shell">
      <header className="page-header">
        <Link href="/" className="back-link">← Home</Link>
        <h1>Pastures</h1>
        <p className="muted">Add pastures on the go and see which animals are assigned to each one.</p>
      </header>

      <form className="form-card" onSubmit={handleSubmit}>
        <label>New pasture name<input required value={form.name} onChange={(event) => updateField("name", event.target.value)} placeholder="Example: North hay field" /></label>
        <label>Notes<textarea value={form.notes} onChange={(event) => updateField("notes", event.target.value)} placeholder="Optional: water, fence, grass condition..." /></label>
        <label>Added by<select value={form.user} onChange={(event) => updateField("user", event.target.value)}><option>Alex</option><option>Riley</option><option>Sam</option><option>Maya</option></select></label>
        <button type="submit" disabled={saving} className="button full">{saving ? "Adding pasture..." : "Add pasture"}</button>
        {message && <p className="field-note">{message}</p>}
      </form>

      <section className="stack">
        {animalsByPasture.map(({ pasture, cows: pastureCows, bulls: pastureBulls }) => (
          <article className="list-card" key={pasture}>
            <div className="row-between">
              <h2>{pasture}</h2>
              <span className="pill">{pastureCows.length} cows • {pastureBulls.length} bulls</span>
            </div>
            {pastureCows.length > 0 || pastureBulls.length > 0 ? (
              <div className="tag-list">
                {pastureCows.map((cow) => <Link href={`/cows/${cow.id}`} key={cow.id}>Cow {cow.tag}</Link>)}
                {pastureBulls.map((bull) => <Link href={`/bulls/${bull.id}`} key={bull.id}>Bull {bull.tag}</Link>)}
              </div>
            ) : <p>No animals assigned here yet.</p>}
          </article>
        ))}
      </section>
    </main>
  );
}
