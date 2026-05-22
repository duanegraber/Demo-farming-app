"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { addVaccination } from "../../components/farmStore";

function AddVaccinationContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [form, setForm] = useState({
    animalType: searchParams.get("type") || "Cow",
    tag: searchParams.get("tag") || "",
    vaccine: "",
    date: new Date().toISOString().slice(0, 10),
    notes: "",
    user: "Sam",
  });

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (!form.tag.trim() || !form.vaccine.trim()) return;
    await addVaccination(form);
    router.push("/activity");
  }

  return (
    <main className="app-shell">
      <header className="page-header">
        <Link href="/" className="back-link">← Home</Link>
        <h1>Add Vaccination</h1>
        <p className="muted">Record vaccine treatments for cows or calves.</p>
      </header>

      <form className="form-card" onSubmit={handleSubmit}>
        <label>Animal type<select value={form.animalType} onChange={(event) => updateField("animalType", event.target.value)}><option>Cow</option><option>Calf</option></select></label>
        <label>Tag number<input required value={form.tag} onChange={(event) => updateField("tag", event.target.value)} placeholder="Cow or calf tag" inputMode="numeric" /></label>
        <label>Vaccine / treatment<input required value={form.vaccine} onChange={(event) => updateField("vaccine", event.target.value)} placeholder="Example: 8-way, scour vaccine..." /></label>
        <label>Date given<input type="date" value={form.date} onChange={(event) => updateField("date", event.target.value)} /></label>
        <label>Notes<textarea value={form.notes} onChange={(event) => updateField("notes", event.target.value)} placeholder="Dose, lot number, booster due, etc." /></label>
        <label>Recorded by<select value={form.user} onChange={(event) => updateField("user", event.target.value)}><option>Sam</option><option>Maya</option><option>Riley</option><option>Alex</option></select></label>
        <button type="submit" className="button full">Save vaccination</button>
      </form>
    </main>
  );
}

export default function AddVaccinationPage() {
  return (
    <Suspense fallback={<main className="app-shell"><p>Loading...</p></main>}>
      <AddVaccinationContent />
    </Suspense>
  );
}
