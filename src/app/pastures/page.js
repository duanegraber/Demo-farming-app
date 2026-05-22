"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { createPasture, loadLocations, loadLivestock, loadSires } from "../components/farmStore";

export default function PasturesPage() {
  const [livestock, setLivestock] = useState([]);
  const [sires, setSires] = useState([]);
  const [locations, setLocations] = useState([]);
  const [form, setForm] = useState({ name: "", notes: "", user: "Alex" });
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  function refreshData() {
    loadLocations().then(setLocations).catch(console.error);
    loadLivestock().then(setLivestock).catch(console.error);
    loadSires().then(setSires).catch(console.error);
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
      setMessage(error.message || "Could not add location.");
    } finally {
      setSaving(false);
    }
  }

  const animalsByLocation = useMemo(() => {
    return locations.map((location) => ({
      location,
      livestock: livestock.filter((animal) => animal.location === location),
      sires: sires.filter((sire) => sire.location === location),
    }));
  }, [livestock, locations, sires]);

  return (
    <main className="app-shell">
      <header className="page-header">
        <Link href="/" className="back-link">← Home</Link>
        <h1>Locations</h1>
        <p className="muted">Add barns, pens, pastures, or fields and see which animals are assigned to each one.</p>
      </header>

      <form className="form-card" onSubmit={handleSubmit}>
        <label>New location name<input required value={form.name} onChange={(event) => updateField("name", event.target.value)} placeholder="Example: North hay field" /></label>
        <label>Notes<textarea value={form.notes} onChange={(event) => updateField("notes", event.target.value)} placeholder="Optional: water, fence, grass condition..." /></label>
        <label>Added by<select value={form.user} onChange={(event) => updateField("user", event.target.value)}><option>Alex</option><option>Riley</option><option>Sam</option><option>Maya</option></select></label>
        <button type="submit" disabled={saving} className="button full">{saving ? "Adding location..." : "Add location"}</button>
        {message && <p className="field-note">{message}</p>}
      </form>

      <section className="stack">
        {animalsByLocation.map(({ location, livestock: locationLivestock, sires: locationSires }) => (
          <article className="list-card" key={location}>
            <div className="row-between">
              <h2>{location}</h2>
              <span className="pill">{locationLivestock.length} animals • {locationSires.length} sires</span>
            </div>
            {locationLivestock.length > 0 || locationSires.length > 0 ? (
              <div className="tag-list">
                {locationLivestock.map((animal) => <Link href={`/livestock/${animal.id}`} key={animal.id}>Animal {animal.tag}</Link>)}
                {locationSires.map((sire) => <Link href={`/sires/${sire.id}`} key={sire.id}>Sire {sire.tag}</Link>)}
              </div>
            ) : <p>No animals assigned here yet.</p>}
          </article>
        ))}
      </section>
    </main>
  );
}
