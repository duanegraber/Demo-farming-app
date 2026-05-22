"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { loadCows, loadPastures, updateCow } from "../../../components/farmStore";

export default function EditCowPage() {
  const params = useParams();
  const router = useRouter();
  const [pastures, setPastures] = useState([]);
  const [form, setForm] = useState(null);

  useEffect(() => {
    const id = window.requestAnimationFrame(() => {
      loadPastures().then(setPastures).catch(console.error);
      loadCows()
        .then((cows) => {
          const cow = cows.find((item) => item.id === params.id);
          if (cow) setForm({ ...cow, calfTag: cow.calfTag || "", purchaseCost: cow.purchaseCost ?? "", dateBought: cow.dateBought || "", sellingAmount: cow.sellingAmount ?? "", dateSold: cow.dateSold || "", user: "Alex" });
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
    await updateCow(params.id, form);
    router.push(`/cows/${params.id}`);
  }

  if (!form) {
    return <main className="app-shell"><Link href="/cows" className="back-link">← Cow list</Link><h1>Loading...</h1></main>;
  }

  return (
    <main className="app-shell">
      <header className="page-header">
        <Link href={`/cows/${params.id}`} className="back-link">← Cow profile</Link>
        <h1>Edit Cow {form.tag}</h1>
        <p className="muted">Update tag changes, sold/dead status, calf info, and notes.</p>
      </header>
      <form className="form-card" onSubmit={handleSubmit}>
        <label>Cow tag number<input required value={form.tag} onChange={(event) => updateField("tag", event.target.value)} inputMode="numeric" /></label>
        <label>Status<select value={form.status} onChange={(event) => updateField("status", event.target.value)}><option>Active</option><option>Watch</option><option>Sold</option><option>Dead</option><option>Culled</option></select></label>
        <label>Color / description<input value={form.color} onChange={(event) => updateField("color", event.target.value)} /></label>
        <label>Pasture<select value={form.location} onChange={(event) => updateField("location", event.target.value)}><option value="">Choose pasture</option>{pastures.map((pasture) => <option key={pasture}>{pasture}</option>)}</select></label>
        <label>Last calved<input value={form.lastCalved} onChange={(event) => updateField("lastCalved", event.target.value)} placeholder="May 5, 2026" /></label>
        <label>Current calf tag<input value={form.calfTag} onChange={(event) => updateField("calfTag", event.target.value)} inputMode="numeric" /></label>
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
