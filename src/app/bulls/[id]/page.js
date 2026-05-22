"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { loadActivity, loadBulls } from "../../components/farmStore";

export default function BullProfile() {
  const params = useParams();
  const [bulls, setBulls] = useState([]);
  const [activity, setActivity] = useState([]);

  useEffect(() => {
    const id = window.requestAnimationFrame(() => {
      loadBulls().then(setBulls).catch(console.error);
      loadActivity().then(setActivity).catch(console.error);
    });
    return () => window.cancelAnimationFrame(id);
  }, []);

  const bull = bulls.find((item) => item.id === params.id);
  const timeline = useMemo(() => {
    if (!bull) return [];
    return activity.filter((item) => item.title?.includes(`Bull ${bull.tag}`) || item.detail?.includes(`Bull ${bull.tag}`));
  }, [activity, bull]);

  if (!bull) {
    return <main className="app-shell"><Link href="/bulls" className="back-link">← Bull list</Link><h1>Loading bull...</h1></main>;
  }

  return (
    <main className="app-shell">
      <header className="page-header">
        <Link href="/bulls" className="back-link">← Bull list</Link>
        <div className="row-between">
          <h1>Bull {bull.tag}</h1>
          <span className={`pill ${bull.status === "Watch" ? "warning" : ""} ${["Sold", "Dead", "Culled"].includes(bull.status) ? "danger" : ""}`}>{bull.status}</span>
        </div>
        <p className="muted">{bull.name} • {bull.breed} • {bull.location}</p>
      </header>

      <section className="detail-grid">
        <div><span>Name</span><strong>{bull.name}</strong></div>
        <div><span>Breed</span><strong>{bull.breed}</strong></div>
        <div><span>Purchase</span><strong>{bull.purchaseCost ? `$${Number(bull.purchaseCost).toLocaleString()}` : "Not recorded"}{bull.dateBought ? ` • ${bull.dateBought}` : ""}</strong></div>
        <div><span>Sale</span><strong>{bull.sellingAmount ? `$${Number(bull.sellingAmount).toLocaleString()}` : "Not sold"}{bull.dateSold ? ` • ${bull.dateSold}` : ""}</strong></div>
        <div><span>Notes</span><strong>{bull.notes}</strong></div>
      </section>

      <section>
        <div className="section-heading"><h2>Quick update</h2></div>
        <div className="action-grid two">
          <Link className="action-card" href={`/bulls/${bull.id}/edit`}><span>✏️</span><strong>Edit bull</strong></Link>
          <Link className="action-card" href={`/vaccinations/new?type=Bull&tag=${bull.tag}`}><span>💉</span><strong>Add vaccination</strong></Link>
          <Link className="action-card" href={`/notes/new?tag=${bull.tag}`}><span>📝</span><strong>Log note</strong></Link>
        </div>
      </section>

      <section>
        <div className="section-heading"><h2>Bull timeline</h2></div>
        <div className="stack">
          {timeline.map((item) => (
            <article className="list-card" key={item.id}>
              <p className="eyebrow">{item.type} • {item.time}</p>
              <h3>{item.title}</h3>
              <p>{item.detail}</p>
              <small>Added by {item.user}</small>
            </article>
          ))}
          {timeline.length === 0 && <article className="list-card"><h3>No timeline yet</h3><p>Log a note for bull {bull.tag} and it will show here.</p></article>}
        </div>
      </section>
    </main>
  );
}
