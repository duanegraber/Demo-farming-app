"use client";

import Link from "next/link";
import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { addNote, loadCows } from "../../components/farmStore";

function NewNoteContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [form, setForm] = useState({ tag: searchParams.get("tag") || "", note: "", user: "Sam" });
  const [cows, setCows] = useState([]);

  useEffect(() => {
    const id = window.requestAnimationFrame(() => {
      loadCows().then(setCows).catch(console.error);
    });
    return () => window.cancelAnimationFrame(id);
  }, []);

  const matchingCowId = useMemo(() => {
    const cow = cows.find((item) => item.tag === form.tag.trim());
    return cow?.id || null;
  }, [cows, form.tag]);

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (!form.note.trim()) return;
    await addNote(form);
    if (matchingCowId) router.push(`/cows/${matchingCowId}`);
    else router.push("/activity");
  }

  return (
    <main className="app-shell">
      <header className="page-header">
        <Link href="/" className="back-link">← Home</Link>
        <h1>Log Note</h1>
        <p className="muted">Save a note to recent activity and the matching cow timeline.</p>
      </header>
      <form className="form-card" onSubmit={handleSubmit}>
        <label>Tag number<input value={form.tag} onChange={(event) => updateField("tag", event.target.value)} placeholder="Cow or calf tag" inputMode="numeric" /></label>
        {form.tag && <p className={matchingCowId ? "helper success" : "helper warning-text"}>{matchingCowId ? "This note will show on the cow profile." : "No matching cow found yet. It will save as general activity."}</p>}
        <label>Note<textarea required rows="6" value={form.note} onChange={(event) => updateField("note", event.target.value)} placeholder="Example: Cow 47 calved black heifer calf tag 112. Looks good." /></label>
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
