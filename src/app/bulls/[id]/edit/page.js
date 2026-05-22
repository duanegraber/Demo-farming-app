"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { loadBulls, loadPastures, updateBull } from "../../../components/farmStore";

export default function EditBullPage() {
  const params = useParams();
  const router = useRouter();
  const [pastures, setPastures] = useState([]);
  const [form, setForm] = useState(null);

  useEffect(() => {
    const id = window.requestAnimationFrame(() => {
      loadPastures().then(setPastures).catch(console.error);
      loadBulls()
        .then((bulls) => {
          const bull = bulls.find((item) => item.id === params.id);
          if (bull) setForm({ ...bull, purchaseCost: bull.purchaseCost ?? "", dateBought: bull.dateBought || "", sellingAmount: bull.sellingAmount ?? "", dateSold: bull.dateSold || "", user: "Alex" });
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
    router.push(`/bulls/${params.id}`);
  }

  if (!form) {
    return <main className="app-shell"><Link href="/bulls" className="back-link">← Bull list</Link><h1>Loading...</h1></main>;
  }

  return (
    <main className="app-shell">
      <header className="page-header">
        <Link href={`/bulls/${params.id}`} className="back-link">← Bull profile</Link>
        <h1>Edit Bull {form.tag}</h1>
        <p className="muted">Update bull status, pasture, purchase/sale info, and notes.</p>
      </header>
      <form className="form-card" onSubmit={handleSubmit}>
        <label>Bull tag number<input required value={form.tag} onChange={(event) => updateField("tag", event.target.value)} /></label>
        <label>Name<input value={form.name} onChange={(event) => updateField("name", event.target.value)} /></label>
        <label>Status<select value={form.status} onChange={(event) => updateField("status", event.target.value)}><option>Active</option><option>Watch</option><option>Sold</option><option>Dead</option><option>Culled</option></select></label>
        <label>Breed<input value={form.breed} onChange={(event) => updateField("breed", event.target.value)} /></label>
        <label>Pasture<select value={form.location} onChange={(event) => updateField("location", event.target.value)}><option value="">Choose pasture</option>{pastures.map((pasture) => <option key={pasture}>{pasture}</option>)}</select></label>
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
