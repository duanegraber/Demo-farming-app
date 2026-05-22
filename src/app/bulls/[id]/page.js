"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { loadActivity, loadBulls } from "../../components/farmStore";

export default function SireProfile() {
  const params = useParams();
  const [sires, setSires] = useState([]);
  const [activity, setActivity] = useState([]);

  useEffect(() => {
    const id = window.requestAnimationFrame(() => {
      loadBulls().then(setSires).catch(console.error);
      loadActivity().then(setActivity).catch(console.error);
    });
    return () => window.cancelAnimationFrame(id);
  }, []);

  const sire = sires.find((item) => item.id === params.id);
  const timeline = useMemo(() => {
    if (!sire) return [];
    return activity.filter((item) => item.title?.includes(`Sire ${sire.tag}`) || item.detail?.includes(`Sire ${sire.tag}`));
  }, [activity, sire]);

  if (!sire) {
    return <main className="app-shell"><Link href="/sires" className="back-link">← Sire list</Link><h1>Loading sire...</h1></main>;
  }

  return (
    <main className="app-shell">
      <header className="page-header">
        <Link href="/sires" className="back-link">← Sire list</Link>
        <div className="row-between">
          <h1>Sire {sire.tag}</h1>
          <span className={`pill ${sire.status === "Watch" ? "warning" : ""} ${["Sold", "Dead", "Culled"].includes(sire.status) ? "danger" : ""}`}>{sire.status}</span>
        </div>
        <p className="muted">{sire.name} • {sire.breed} • {sire.location}</p>
      </header>

      <section className="detail-grid">
        <div><span>Name</span><strong>{sire.name}</strong></div>
        <div><span>Breed</span><strong>{sire.breed}</strong></div>
        <div><span>Purchase</span><strong>{sire.purchaseCost ? `$${Number(sire.purchaseCost).toLocaleString()}` : "Not recorded"}{sire.dateBought ? ` • ${sire.dateBought}` : ""}</strong></div>
        <div><span>Sale</span><strong>{sire.sellingAmount ? `$${Number(sire.sellingAmount).toLocaleString()}` : "Not sold"}{sire.dateSold ? ` • ${sire.dateSold}` : ""}</strong></div>
        <div><span>Notes</span><strong>{sire.notes}</strong></div>
      </section>

      <section>
        <div className="section-heading"><h2>Quick update</h2></div>
        <div className="action-grid two">
          <Link className="action-card" href={`/sires/${sire.id}/edit`}><span>✏️</span><strong>Edit sire</strong></Link>
          <Link className="action-card" href={`/vaccinations/new?type=Sire&tag=${sire.tag}`}><span>💉</span><strong>Add vaccination</strong></Link>
          <Link className="action-card" href={`/notes/new?tag=${sire.tag}`}><span>📝</span><strong>Log note</strong></Link>
        </div>
      </section>

      <section>
        <div className="section-heading"><h2>Sire timeline</h2></div>
        <div className="stack">
          {timeline.map((item) => (
            <article className="list-card" key={item.id}>
              <p className="eyebrow">{item.type} • {item.time}</p>
              <h3>{item.title}</h3>
              <p>{item.detail}</p>
              <small>Added by {item.user}</small>
            </article>
          ))}
          {timeline.length === 0 && <article className="list-card"><h3>No timeline yet</h3><p>Log a note for sire {sire.tag} and it will show here.</p></article>}
        </div>
      </section>
    </main>
  );
}
