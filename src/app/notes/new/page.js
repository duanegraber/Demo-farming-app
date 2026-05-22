"use client";

import Link from "next/link";
import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { addNote, loadLivestock } from "../../components/farmStore";

function NewNoteContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [form, setForm] = useState({ tag: searchParams.get("tag") || "", note: "", user: "Sam" });
  const [livestock, setLivestock] = useState([]);

  useEffect(() => {
    const id = window.requestAnimationFrame(() => {
      loadLivestock().then(setLivestock).catch(console.error);
    });
    return () => window.cancelAnimationFrame(id);
  }, []);

  const matchingCowId = useMemo(() => {
    const animal = livestock.find((item) => item.tag === form.tag.trim());
    return animal?.id || null;
  }, [livestock, form.tag]);

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (!form.note.trim()) return;
    await addNote(form);
    if (matchingCowId) router.push(`/livestock/${matchingCowId}`);
    else router.push("/activity");
  }

  return (
    <main className="app-shell">
      <header className="page-header">
        <Link href="/" className="back-link">← Home</Link>
        <h1>Log Note</h1>
        <p className="muted">Save a note to recent activity and the matching animal timeline.</p>
      </header>
      <form className="form-card" onSubmit={handleSubmit}>
        <label>Tag number<input value={form.tag} onChange={(event) => updateField("tag", event.target.value)} placeholder="Animal or offspring tag" inputMode="numeric" /></label>
        {form.tag && <p className={matchingCowId ? "helper success" : "helper warning-text"}>{matchingCowId ? "This note will show on the animal profile." : "No matching animal found yet. It will save as general activity."}</p>}
        <label>Note<textarea required rows="6" value={form.note} onChange={(event) => updateField("note", event.target.value)} placeholder="Example: Animal 47 had healthy offspring tag 112. Looks good." /></label>
        <label>Added by<select value={form.user} onChange={(event) => updateField("user", event.target.value)}><option>Sam</option><option>Maya</option><option>Riley</option><option>Alex</option></select></label>
        <button type="submit" className="button full">Save note</button>
      </form>
    </main>
  );
}


export default function Page() {
  return (
    <Suspense fallback={<main className="app-shell"><p>Loading...</p></main>}>
      <NewNoteContent />
    </Suspense>
  );
}
