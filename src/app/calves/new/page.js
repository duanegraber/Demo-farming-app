"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";
import { createCalf, loadLivestock } from "../../components/farmStore";

function AddCalfContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [livestock, setLivestock] = useState([]);
  const [form, setForm] = useState({
    cowTag: searchParams.get("cowTag") || searchParams.get("tag") || "",
    tag: "",
    born: "",
    sex: "Unknown",
    status: "Active",
    notes: "",
    user: "Sam",
  });

  useEffect(() => {
    const id = window.requestAnimationFrame(() => {
      loadLivestock().then(setLivestock).catch(console.error);
    });
    return () => window.cancelAnimationFrame(id);
  }, []);

  const matchingAnimal = useMemo(() => livestock.find((animal) => animal.tag === form.cowTag.trim()), [livestock, form.cowTag]);

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (!form.cowTag.trim() || !form.tag.trim()) return;
    await createCalf(form);
    if (matchingAnimal) router.push(`/livestock/${matchingAnimal.id}`);
    else router.push("/livestock");
  }

  return (
    <main className="app-shell">
      <header className="page-header">
        <Link href="/" className="back-link">← Home</Link>
        <h1>Add Offspring</h1>
        <p className="muted">Fast offspring entry built around the parent animal tag first.</p>
      </header>
      <form className="form-card" onSubmit={handleSubmit}>
        <label>Parent animal tag<input required value={form.cowTag} onChange={(event) => updateField("cowTag", event.target.value)} placeholder="Animal tag" inputMode="numeric" /></label>
        {form.cowTag && <p className={matchingCow ? "helper success" : "helper warning-text"}>{matchingAnimal ? `Linked to animal ${matchingAnimal.tag}.` : "No matching animal found yet. Offspring will still save, but check the parent tag."}</p>}
        <label>Offspring tag<input required value={form.tag} onChange={(event) => updateField("tag", event.target.value)} placeholder="Offspring tag" inputMode="numeric" /></label>
        <label>Birth date<input type="date" value={form.born} onChange={(event) => updateField("born", event.target.value)} /></label>
        <label>Sex<select value={form.sex} onChange={(event) => updateField("sex", event.target.value)}><option>Unknown</option><option>Male</option><option>Female</option></select></label>
        <label>Status<select value={form.status} onChange={(event) => updateField("status", event.target.value)}><option>Active</option><option>Sold</option><option>Dead</option><option>Kept back</option><option>Unknown</option></select></label>
        <label>Quick note<textarea value={form.notes} onChange={(event) => updateField("notes", event.target.value)} placeholder="Looks good, needs watching, etc." /></label>
        <label>Added by<select value={form.user} onChange={(event) => updateField("user", event.target.value)}><option>Sam</option><option>Maya</option><option>Riley</option><option>Alex</option></select></label>
        <button type="submit" className="button full">Save offspring</button>
      </form>
    </main>
  );
}

export default function AddCalfPage() {
  return (
    <Suspense fallback={<main className="app-shell"><p>Loading...</p></main>}>
      <AddCalfContent />
    </Suspense>
  );
}
